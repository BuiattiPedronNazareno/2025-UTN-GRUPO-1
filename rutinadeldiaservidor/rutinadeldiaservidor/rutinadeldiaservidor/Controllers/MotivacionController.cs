using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MotivacionController : ControllerBase
    {
        private readonly RutinaContext _context;

        public MotivacionController(RutinaContext context)
        {
            _context = context;
        }

        // POST: api/Motivacion/crearMotivacion
        [HttpPost("crearMotivacion")]
        public async Task<ActionResult<MotivacionReadDTO>> CrearMotivacion(MotivacionCreateDTO motivacionDTO)
        {
            var rutina = await _context.Rutinas.FindAsync(motivacionDTO.RutinaId);
            var infante = await _context.Infantes
                .Include(i => i.InfanteNivel)
                .FirstOrDefaultAsync(i => i.Id == motivacionDTO.InfanteId);

            if (rutina == null || infante == null)
                return NotFound("No se encontró la rutina o el infante.");

            string descripcion = $"Completaste la rutina '{rutina.Nombre}' en la fecha {DateTime.UtcNow:dd/MM/yyyy}";

            var motivacion = new Motivacion
            {
                Descripcion = descripcion,
                Fecha = DateTime.UtcNow,
                RutinaId = motivacionDTO.RutinaId,
                InfanteId = motivacionDTO.InfanteId
            };

            _context.Motivaciones.Add(motivacion);
            await _context.SaveChangesAsync();

            int totalMotivaciones = await _context.Motivaciones
                .CountAsync(m => m.InfanteId == motivacionDTO.InfanteId);

            string nuevoNivel = infante.InfanteNivel.Descripcion;
            bool subioNivel = false;

            if (totalMotivaciones >= 5 && infante.InfanteNivel.Descripcion == "Principiante")
                nuevoNivel = "Intermedio";
            else if (totalMotivaciones >= 10 && infante.InfanteNivel.Descripcion == "Intermedio")
                nuevoNivel = "Avanzado";
            else if (totalMotivaciones >= 20 && infante.InfanteNivel.Descripcion == "Avanzado")
                nuevoNivel = "Experto";

            if (nuevoNivel != infante.InfanteNivel.Descripcion)
            {
                var nivelNuevo = await _context.InfanteNiveles
                    .FirstOrDefaultAsync(n => n.Descripcion == nuevoNivel);

                if (nivelNuevo != null)
                {
                    infante.InfanteNivelId = nivelNuevo.Id;
                    subioNivel = true;
                    await _context.SaveChangesAsync();
                }
            }

            var resultDTO = new MotivacionReadDTO
            {
                Id = motivacion.Id,
                Descripcion = motivacion.Descripcion,
                Fecha = motivacion.Fecha
            };

            return Ok(new MotivacionResponseDTO
            {
                Motivacion = resultDTO,
                TotalMotivaciones = totalMotivaciones,
                SubioNivel = subioNivel,
                NuevoNivel = nuevoNivel
            });
        }

        // GET: api/Motivacion/obtenerMotivacionesInfante/5
        [HttpGet("obtenerMotivacionesInfante/{infanteId}")]
        public async Task<ActionResult<IEnumerable<MotivacionReadDTO>>> ObtenerMotivacionesPorInfante(int infanteId)
        {
            var motivaciones = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .Select(m => new MotivacionReadDTO
                {
                    Id = m.Id,
                    Descripcion = m.Descripcion,
                    Fecha = m.Fecha
                })
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();

            if (!motivaciones.Any())
                return NotFound("Este infante aún no tiene motivaciones.");

            return Ok(motivaciones);
        }

        // DELETE: api/Motivacion/eliminarMotivacion/5
        [HttpDelete("eliminarMotivacion/{id}")]
        public async Task<IActionResult> EliminarMotivacion(int id)
        {
            var motivacion = await _context.Motivaciones.FindAsync(id);
            if (motivacion == null)
                return NotFound("Motivación no encontrada.");

            _context.Motivaciones.Remove(motivacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/Motivacion/obtenerTodas
        [HttpGet("obtenerTodas")]
        public async Task<ActionResult<IEnumerable<MotivacionReadDTO>>> ObtenerTodasMotivaciones()
        {
            var motivaciones = await _context.Motivaciones
                .Select(m => new MotivacionReadDTO
                {
                    Id = m.Id,
                    Descripcion = m.Descripcion,
                    Fecha = m.Fecha
                })
                .OrderByDescending(m => m.Fecha)
                .ToListAsync();

            if (!motivaciones.Any())
                return NotFound("No hay motivaciones registradas.");

            return Ok(motivaciones);
        }

    }
}
