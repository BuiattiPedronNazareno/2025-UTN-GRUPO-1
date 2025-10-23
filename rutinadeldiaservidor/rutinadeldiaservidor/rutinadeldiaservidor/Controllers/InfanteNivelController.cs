using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InfanteNivelController : ControllerBase
    {
        private readonly RutinaContext _context;

        public InfanteNivelController(RutinaContext context)
        {
            _context = context;
        }

        // POST api/InfanteNivel/crear
        [HttpPost("crear")]
        public async Task<ActionResult<InfanteNivel>> CrearInfanteNivel([FromBody] InfanteNivelCreateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Descripcion))
                return BadRequest("La descripción es obligatoria");

            var nivel = new InfanteNivel
            {
                Descripcion = dto.Descripcion
            };

            _context.InfanteNiveles.Add(nivel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObtenerInfanteNivelPorId), new { id = nivel.Id }, nivel);
        }

        // GET api/InfanteNivel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InfanteNivel>>> ObtenerInfanteNiveles()
        {
            var niveles = await _context.InfanteNiveles
                .Select(n => new InfanteNivelGetDTO
                {
                    Id = n.Id,
                    Descripcion = n.Descripcion
                })
                .ToListAsync();

            return Ok(niveles);
        }

        // GET api/InfanteNivel/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<InfanteNivel>> ObtenerInfanteNivelPorId(int id)
        {
            var nivel = await _context.InfanteNiveles
                .Where(n => n.Id == id)
                .Select(n => new InfanteNivelGetDTO
                {
                    Id = n.Id,
                    Descripcion = n.Descripcion
                })
                .FirstOrDefaultAsync();

            if (nivel == null)
                return NotFound("No se encontró el nivel de infante");

            return Ok(nivel);
        }
    }
}
