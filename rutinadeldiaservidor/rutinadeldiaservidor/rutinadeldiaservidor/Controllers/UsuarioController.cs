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
        private readonly ISmsService _smsService;
        private readonly ILogger<UsuarioController> _logger;

        public UsuarioController(
            RutinaContext context,
            TemporalVerificationCodeService temporalCodeService,
            ISmsService smsService,
            ILogger<UsuarioController> logger)
        {
            _context = context;
            _temporalCodeService = temporalCodeService;
            _smsService = smsService;
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
                PinAdulto = adulto.Pin,
                Infantes = usuario.Infantes?.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
                }).ToList() ?? new List<InfanteGetDTO>()
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
                Infantes = usuario.Infantes.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
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
                Infantes = usuario.Infantes?.Select(i => new InfanteGetDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    InfanteNivelId = i.InfanteNivelId,
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
        [AllowAnonymous] 
        public async Task<IActionResult> InitiateTelegramLink([FromBody] InitiateTelegramDTO dto)
        {
            if (dto == null || dto.UserId <= 0)
                return BadRequest("Datos inválidos");

            var user = await _context.Usuarios.FindAsync(dto.UserId);
            if (user == null)
                return NotFound("Usuario no encontrado");

            if (string.IsNullOrWhiteSpace(user.Telefono))
                return BadRequest("El usuario no tiene un número de teléfono válido.");


            var code = GenerateVerificationCode();

            var userIdKey = $"telegram_verify_{user.Id}";
            var validityPeriod = TimeSpan.FromMinutes(10);
            _temporalCodeService.StoreCode(userIdKey, code, validityPeriod);

            var message = $"Bienvenido a Rutina del Dia. Para vincular tu cuenta de Telegram, inicia una conversación con nuestro bot en @TuBotDeRutinasBot y envía este código: {code}";

            var smsSent = await _smsService.SendSmsAsync(user.Telefono, message);
            if (!smsSent)
            {
                _temporalCodeService.TryGetAndRemoveCode(userIdKey, out _); // eliminar código temporal si falla
                return StatusCode(500, "Error al enviar el código de verificación. Inténtalo más tarde.");
            }

            return Ok(new { success = true, message = "Vinculación iniciada" });
        }

        // Función auxiliar para generar código de 4 dígitos
        private string GenerateVerificationCode()
        {
            var random = new Random();
            int codeNumber = random.Next(1000, 9999);
            return codeNumber.ToString();
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
