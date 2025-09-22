using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly RutinaContext _context;

        public UsuarioController(RutinaContext context)
        {
            _context = context;
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
            var usuario = new Usuario
            {
                Email = usuarioDTO.Email,
                Clave = usuarioDTO.Clave, // ⚠ Encriptar luego
                Telefono = usuarioDTO.Telefono
            };

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
                Infantes = new List<string>() // vacío recién creado
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
                Infantes = usuario.Infantes.Select(i => i.Nombre).ToList()
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

            // Verificar contraseña (a futuro, encriptar)
            if (usuario.Clave != loginDTO.Clave)
                return Unauthorized("Usuario o clave incorrecta");

            // Crear DTO para devolver al cliente
            var dto = new UsuarioGetDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                PinAdulto = usuario.Adulto?.Pin ?? 0,
                Infantes = usuario.Infantes.Select(i => i.Nombre).ToList()
            };

            return Ok(dto);
        }

        // POST api/usuario/agregarInfante
        [HttpPost("agregarInfante")]
        public async Task<ActionResult> AgregarInfante([FromBody] InfanteCreateDTO infanteDTO)
        {
            if (infanteDTO == null)
                return BadRequest("Datos inválidos");

            // Verificar que el usuario exista
            var usuario = await _context.Usuarios
                .Include(u => u.Infantes)
                .FirstOrDefaultAsync(u => u.Id == infanteDTO.UsuarioId);

            if (usuario == null)
                return NotFound("Usuario no encontrado");

            // Verificar que el InfanteNivel exista
            var nivel = await _context.InfanteNiveles
                .FirstOrDefaultAsync(n => n.Id == infanteDTO.InfanteNivelId);

            if (nivel == null)
                return NotFound("Nivel de infante no encontrado");

            // Crear entidad Infante
            var infante = new Infante
            {
                Nombre = infanteDTO.Nombre,
                UsuarioId = infanteDTO.UsuarioId,
                InfanteNivelId = infanteDTO.InfanteNivelId
            };

            _context.Infantes.Add(infante);
            await _context.SaveChangesAsync();

            return Ok(new { Mensaje = "Infante agregado correctamente", InfanteId = infante.Id });
        }


    }
}
