using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InfanteController : ControllerBase
    {
        private readonly RutinaContext _context;

        public InfanteController(RutinaContext context)
        {
            _context = context;
        }

        // POST api/infante/agregarInfante
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
