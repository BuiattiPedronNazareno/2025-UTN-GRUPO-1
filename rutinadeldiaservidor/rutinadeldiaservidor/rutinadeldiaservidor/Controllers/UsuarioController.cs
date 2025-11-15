using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Services; 
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;


namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly RutinaContext _context;
        private readonly TemporalVerificationCodeService _temporalCodeService;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController(
            RutinaContext context,
            TemporalVerificationCodeService temporalCodeService,
            ILogger<UsuarioController> logger)
        {
            _context = context;
            _temporalCodeService = temporalCodeService;
            _logger = logger;
        }


        // POST api/usuario/registrarUsuario
        [HttpPost("registrarUsuario")]
        public async Task<ActionResult<Usuario>> RegistrarUsuario([FromBody] UsuarioCreateDTO usuarioDTO)
        {
            // Validación básica
            if (usuarioDTO == null)
                return BadRequest("Datos de usuario inválidos");

            // Verificar si el email ya existe
            var existeEmail = await _context.Usuarios
                .AnyAsync(u => u.Email == usuarioDTO.Email);

            if (existeEmail)
                return Conflict("El email ya está registrado");

            // Crear la cuenta Usuario
            var passwordHasher = new PasswordHasher<Usuario>();
            var usuario = new Usuario
            {
                Email = usuarioDTO.Email,
                Telefono = usuarioDTO.Telefono,
                Infantes = new List<Infante>()
            };
            usuario.Clave = passwordHasher.HashPassword(usuario, usuarioDTO.Clave);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync(); // Genera el Id de usuario

            // Crear la entidad Adulto asociada
            var adulto = new Adulto
            {
                Id = usuario.Id, // mismo Id que Usuario
                Pin = usuarioDTO.Pin
            };

            _context.Adultos.Add(adulto);
            await _context.SaveChangesAsync();

            var dto = new UsuarioGetDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                PinAdulto = usuario.Adulto?.Pin ?? 0,
                Infantes = usuario.Infantes.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
                    UsuarioId = i.UsuarioId
                }).ToList(),
                RecibeNotificacionesCancelacion = usuario.RecibeNotificacionesCancelacion
            };


            return CreatedAtAction(nameof(GetUsuarioPorId), new { id = usuario.Id }, dto);

        }

        // GET api/usuario/obtenerUsuario/5
        [HttpGet("obtenerUsuario/{id}")]
        public async Task<ActionResult<UsuarioGetDTO>> GetUsuarioPorId(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Adulto)
                .Include(u => u.Infantes)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null)
                return NotFound();

            var dto = new UsuarioGetDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                PinAdulto = usuario.Adulto?.Pin ?? 0,
                RecibeNotificacionesCancelacion = usuario.RecibeNotificacionesCancelacion,
                Infantes = usuario.Infantes.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
                    UsuarioId = i.UsuarioId
                }).ToList()
            };

            return Ok(dto);
        }

        // POST api/usuario/login
        [HttpPost("login")]
        public async Task<ActionResult<UsuarioGetDTO>> Login([FromBody] UsuarioLoginDTO loginDTO)
        {
            if (loginDTO == null)
                return BadRequest("Datos inválidos");

            // Buscar usuario por email
            var usuario = await _context.Usuarios
                .Include(u => u.Adulto)
                .Include(u => u.Infantes)
                .FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

            if (usuario == null)
                return Unauthorized("Usuario o clave incorrecta");

            // Verificar contraseña hasheada
            var passwordHasher = new PasswordHasher<Usuario>();
            var result = passwordHasher.VerifyHashedPassword(usuario, usuario.Clave, loginDTO.Clave);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Usuario o clave incorrecta");

            // Crear DTO para devolver al cliente
            var dto = new UsuarioGetDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                PinAdulto = usuario.Adulto?.Pin ?? 0,
                RecibeNotificacionesCancelacion = usuario.RecibeNotificacionesCancelacion, 
                Infantes = usuario.Infantes?.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
                    UsuarioId = i.UsuarioId 
                }).ToList() ?? new List<InfanteGetDTO>() 
            };

            return Ok(dto);
        }

        [HttpGet("tutorial-status/{usuarioId}")]
        public IActionResult GetTutorialStatus(int usuarioId)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == usuarioId);
            if (usuario == null) return NotFound();

            return Ok(new
            {
                showAdultTutorial = !usuario.HasSeenAdultTutorial
            });
        }

        [HttpPost("tutorial-completed/{usuarioId}")]
        public IActionResult MarkAdultTutorialCompleted(int usuarioId)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == usuarioId);
            if (usuario == null) return NotFound();

            usuario.HasSeenAdultTutorial = true;
            _context.SaveChanges();
            return Ok();
        }


        [HttpPost("initiate-telegram-link")]
        public async Task<IActionResult> InitiateTelegramLink([FromBody] InitiateTelegramDTO dto)
        {
            if (dto == null || dto.UserId <= 0)
                return BadRequest("Datos inválidos");

            var usuario = await _context.Usuarios.FindAsync(dto.UserId);
            if (usuario == null)
                return NotFound("Usuario no encontrado");

            var codigo = new Random().Next(1000, 9999).ToString();
            usuario.CodigoVerificacion = codigo;
            usuario.CodigoExpira = DateTime.UtcNow.AddMinutes(5);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Código generado",
                codigo
            });
        }

        [HttpPost("verificar-codigo")]
        public async Task<IActionResult> VerificarCodigo([FromBody] VerificarCodigoDTO dto)
        {
            if (dto == null)
                return BadRequest("Datos inválidos");

            var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
            if (usuario == null)
                return NotFound("Usuario no encontrado.");

            if (usuario.CodigoExpira < DateTime.UtcNow)
                return BadRequest("El código expiró.");

            if (usuario.CodigoVerificacion != dto.CodigoIngresado)
                return BadRequest("Código incorrecto.");

            usuario.Verificado = true;
            usuario.CodigoVerificacion = null;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Cuenta verificada" });
        }

        [HttpPut("{usuarioId}/notificaciones-cancelacion")]
        public async Task<IActionResult> ActualizarNotificaciones(int usuarioId, [FromBody] UpdateNotificacionesDTO dto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Adulto)           
                .Include(u => u.Infantes)       
                .FirstOrDefaultAsync(u => u.Id == usuarioId);
            if (usuario == null) return NotFound();
            usuario.RecibeNotificacionesCancelacion = dto.RecibeNotificaciones;
            await _context.SaveChangesAsync();
            var usuarioDTO = new UsuarioGetDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                PinAdulto = usuario.Adulto?.Pin ?? 0,
                RecibeNotificacionesCancelacion = usuario.RecibeNotificacionesCancelacion,
                Infantes = usuario.Infantes.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
                    UsuarioId = i.UsuarioId
                }).ToList()
            };

            return Ok(usuarioDTO);
        }

        public class UpdateNotificacionesDTO
        {
            public bool RecibeNotificaciones { get; set; }
        }


        private string GenerarCodigo()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private int GetUserIdFromContext()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            
            return 0; 
        }


    }
}
