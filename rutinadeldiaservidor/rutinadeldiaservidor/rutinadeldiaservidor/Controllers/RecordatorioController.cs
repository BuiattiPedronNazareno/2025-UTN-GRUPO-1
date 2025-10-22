using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecordatorioController : ControllerBase
    {
        private readonly RutinaContext _context;

        public RecordatorioController(RutinaContext context)
        {
            _context = context;
        }

        // GET api/recordatorio/obtenerRecordatorios
        [HttpGet("obtenerRecordatorios")]
        public async Task<ActionResult<IEnumerable<RecordatorioReadDTO>>> GetAll()
        {
            var recordatorios = await _context.Recordatorios
                .Include(r => r.Rutina)
                .Select(r => new RecordatorioReadDTO
                {
                    Id = r.Id,
                    Descripcion = r.Descripcion,
                    Frecuencia = r.Frecuencia,
                    Hora = r.Hora,
                    DiaSemana = r.DiaSemana,
                    Sonido = r.Sonido,
                    Color = r.Color,
                    RutinaId = r.RutinaId,
                    RutinaNombre = r.Rutina.Nombre
                })
                .ToListAsync();

            return Ok(recordatorios);
        }
        
    // GET api/recordatorio/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RecordatorioReadDTO>> GetById(int id)
    {
        var recordatorio = await _context.Recordatorios
            .Include(r => r.Rutina)
            .Where(r => r.Id == id)
            .Select(r => new RecordatorioReadDTO
            {
                Id = r.Id,
                Descripcion = r.Descripcion,
                Frecuencia = r.Frecuencia,
                Hora = r.Hora,
                DiaSemana = r.DiaSemana,
                Sonido = r.Sonido,
                Color = r.Color,
                RutinaId = r.RutinaId,
                RutinaNombre = r.Rutina.Nombre
            })
            .FirstOrDefaultAsync();

        return recordatorio == null ? NotFound() : Ok(recordatorio);
    }


    // POST api/recordatorio/crearRecordatorio
    [HttpPost("crearRecordatorio")]
    public async Task<ActionResult<RecordatorioReadDTO>> Create(RecordatorioCreateDTO recordatorioDTO)
    {
        // Verificar que la rutina existe
        var rutina = await _context.Rutinas.FindAsync(recordatorioDTO.RutinaId);
        if (rutina == null)
            return BadRequest("La rutina especificada no existe");

        // 🎯 NUEVA VALIDACIÓN: Verificar límite de 5 recordatorios por rutina
        var recordatoriosExistentes = await _context.Recordatorios
            .Where(r => r.RutinaId == recordatorioDTO.RutinaId)
            .CountAsync();
        
        if (recordatoriosExistentes > 5)
        {
            return BadRequest("No se pueden crear más de 5 recordatorios de frecuencia diaria para esta rutina");
        }

        var recordatorio = new Recordatorio
        {
            Descripcion = recordatorioDTO.Descripcion,
            Frecuencia = recordatorioDTO.Frecuencia,
            Hora = recordatorioDTO.Hora,
            DiaSemana = recordatorioDTO.DiaSemana,
            Sonido = recordatorioDTO.Sonido,
            Color = recordatorioDTO.Color,
            RutinaId = recordatorioDTO.RutinaId,
            Rutina = rutina
        };
    
        _context.Recordatorios.Add(recordatorio);
        await _context.SaveChangesAsync();
    
        var recordatorioReadDTO = new RecordatorioReadDTO
        {
            Id = recordatorio.Id,
            Descripcion = recordatorio.Descripcion,
            Frecuencia = recordatorio.Frecuencia,
            Hora = recordatorio.Hora,
            DiaSemana = recordatorio.DiaSemana,
            Sonido = recordatorio.Sonido,
            Color = recordatorio.Color,
            RutinaId = recordatorio.RutinaId,
            RutinaNombre = rutina.Nombre
        };
    
        return CreatedAtAction(nameof(GetById), new { id = recordatorio.Id }, recordatorioReadDTO);
    }

        // PUT api/recordatorio/actualizarRecordatorio/5
        [HttpPut("actualizarRecordatorio/{id}")]
        public async Task<IActionResult> Update(int id, RecordatorioUpdateDTO recordatorioDTO)
        {
            var recordatorioExistente = await _context.Recordatorios.FindAsync(id);
            if (recordatorioExistente == null)
                return NotFound();

            // Validar rutina si se está cambiando
            if (recordatorioDTO.RutinaId != recordatorioExistente.RutinaId)
            {
                var rutina = await _context.Rutinas.FindAsync(recordatorioDTO.RutinaId);
                if (rutina == null)
                    return BadRequest("La rutina especificada no existe");
            }

            recordatorioExistente.Descripcion = recordatorioDTO.Descripcion;
            recordatorioExistente.Frecuencia = recordatorioDTO.Frecuencia;
            recordatorioExistente.Hora = recordatorioDTO.Hora;
            recordatorioExistente.DiaSemana = recordatorioDTO.DiaSemana;
            recordatorioExistente.Sonido = recordatorioDTO.Sonido;
            recordatorioExistente.Color = recordatorioDTO.Color;
            recordatorioExistente.RutinaId = recordatorioDTO.RutinaId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/recordatorio/eliminarRecordatorio/5
        [HttpDelete("eliminarRecordatorio/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recordatorio = await _context.Recordatorios.FindAsync(id);
            if (recordatorio == null) return NotFound();

            _context.Recordatorios.Remove(recordatorio);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET api/recordatorio/porRutina/5
        [HttpGet("porRutina/{rutinaId}")]
        public async Task<ActionResult<IEnumerable<RecordatorioReadDTO>>> GetByRutina(int rutinaId)
        {
            var recordatorios = await _context.Recordatorios
                .Include(r => r.Rutina)
                .Where(r => r.RutinaId == rutinaId)
                .Select(r => new RecordatorioReadDTO
                {
                    Id = r.Id,
                    Descripcion = r.Descripcion,
                    Frecuencia = r.Frecuencia,
                    Hora = r.Hora,
                    DiaSemana = r.DiaSemana,
                    Sonido = r.Sonido,
                    Color = r.Color,
                    RutinaId = r.RutinaId,
                    RutinaNombre = r.Rutina.Nombre
                })
                .ToListAsync();

            return recordatorios.Any() ? Ok(recordatorios) : NotFound();
        }
    }
}
