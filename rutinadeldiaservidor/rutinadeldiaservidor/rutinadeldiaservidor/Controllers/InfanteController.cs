using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.DTOs;
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

            // Verificar que el nivel exista
            var nivel = await _context.InfanteNiveles
                .FirstOrDefaultAsync(n => n.Id == infanteDTO.InfanteNivelId);

            if (nivel == null)
                return NotFound("Nivel de infante no encontrado");

            // Crear infante
            var infante = new Infante
            {
                Nombre = infanteDTO.Nombre,
                UsuarioId = infanteDTO.UsuarioId,
                InfanteNivelId = infanteDTO.InfanteNivelId
            };

            _context.Infantes.Add(infante);
            await _context.SaveChangesAsync();

            // Si no se seleccionaron categorías, devolvemos solo la creación del infante
            if (infanteDTO.CategoriaIds == null || !infanteDTO.CategoriaIds.Any())
                return Ok(new { Mensaje = "Infante agregado correctamente", InfanteId = infante.Id });

            // TRANSACCIÓN: clonación de rutinas y pasos
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var categoriaId in infanteDTO.CategoriaIds)
                {
                    // Buscar rutinas precargadas (sin infante)
                    var rutinasBase = await _context.Rutinas
                        .Include(r => r.Pasos)
                        .Where(r => r.CategoriaId == categoriaId && r.InfanteId == null)
                        .ToListAsync();

                    foreach (var rutinaBase in rutinasBase)
                    {
                        // Crear una copia de la rutina
                        var nuevaRutina = new Rutina
                        {
                            Nombre = rutinaBase.Nombre,
                            Imagen = rutinaBase.Imagen,
                            Estado = rutinaBase.Estado,
                            FechaCreacion = DateTime.UtcNow,
                            InfanteId = infante.Id,
                            CategoriaId = rutinaBase.CategoriaId
                        };

                        _context.Rutinas.Add(nuevaRutina);
                        await _context.SaveChangesAsync();

                        // Clonar pasos
                        foreach (var paso in rutinaBase.Pasos)
                        {
                            var nuevoPaso = new Paso
                            {
                                Orden = paso.Orden,
                                Descripcion = paso.Descripcion,
                                Estado = paso.Estado,
                                Imagen = paso.Imagen,
                                Audio = paso.Audio,
                                RutinaId = nuevaRutina.Id
                            };

                            _context.Pasos.Add(nuevoPaso);
                        }

                        await _context.SaveChangesAsync();
                    }
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Mensaje = "Error al clonar rutinas precargadas", Detalle = ex.Message });
            }

            return Ok(new
            {
                Mensaje = "Infante agregado correctamente y rutinas precargadas clonadas.",
                InfanteId = infante.Id
            });
        }


        // GET: /Infante/obtenerInfantesPorUsuario/{usuarioId}
        [HttpGet("obtenerInfantesPorUsuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<InfanteReadDTO>>> ObtenerInfantesPorUsuario(int usuarioId)
        {
            var infantes = await _context.Infantes
                .Where(i => i.UsuarioId == usuarioId)
                .Select(i => new InfanteReadDTO
                {
                    Id = i.Id,
                    Nombre = i.Nombre,
                    UsuarioId = i.UsuarioId,
                    InfanteNivelId = i.InfanteNivelId
                })
                .ToListAsync();

            if (infantes.Count == 0)
            {
                return NotFound("No se encontraron infantes para este usuario.");
            }

            return Ok(infantes);
        }

        [HttpGet("tutorial-status/{infanteId}")]
        public IActionResult GetTutorialStatus(int infanteId)
        {
            var infante = _context.Infantes.FirstOrDefault(i => i.Id == infanteId);
            if (infante == null) return NotFound();

            return Ok(new
            {
                showInfantTutorial = !infante.HasSeenInfantTutorial
            });
        }

        [HttpPost("tutorial-completed/{infanteId}")]
        public IActionResult MarkInfantTutorialCompleted(int infanteId)
        {
            var infante = _context.Infantes.FirstOrDefault(i => i.Id == infanteId);
            if (infante == null) return NotFound();

            infante.HasSeenInfantTutorial = true;
            _context.SaveChanges();
            return Ok();
        }

    }
}
