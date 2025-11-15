using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Hangfire;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using rutinadeldiaservidor.Services;
using SignalRReminder.Hubs;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecordatorioController : ControllerBase
    {
        private readonly RutinaContext _context;
        private readonly IHubContext<RemindersHub> _hubContext;
        private readonly IRecordatorioService _recordatorioService; // 🆕

        public RecordatorioController(
            RutinaContext context, 
            IHubContext<RemindersHub> hubContext,
            IRecordatorioService recordatorioService) // 🆕
        {
            _context = context;
            _hubContext = hubContext;
            _recordatorioService = recordatorioService; // 🆕
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
                    Activo = r.Activo, // 🆕
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
                    Activo = r.Activo, // 🆕
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
            // 🔍 Validar que si es Semanal, DiaSemana sea obligatorio
            if (recordatorioDTO.Frecuencia.ToLower() == "semanal")
            {
                if (string.IsNullOrWhiteSpace(recordatorioDTO.DiaSemana))
                {
                    return BadRequest("Para frecuencia Semanal, debe especificar el día de la semana");
                }

                // 🆕 Validar que el día sea válido
                var diasValidos = new[] { "lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado", "domingo" };
                if (!diasValidos.Contains(recordatorioDTO.DiaSemana.ToLower().Trim()))
                {
                    return BadRequest("DiaSemana debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo");
                }
            }

            // Verificar que la rutina existe
            var rutina = await _context.Rutinas.FindAsync(recordatorioDTO.RutinaId);
            if (rutina == null)
                return BadRequest("La rutina especificada no existe");

            // Verificar límite de 5 recordatorios por rutina
            var recordatoriosExistentes = await _context.Recordatorios
                .Where(r => r.RutinaId == recordatorioDTO.RutinaId)
                .CountAsync();

            if (recordatoriosExistentes >= 5)
            {
                return BadRequest("No se pueden crear más de 5 recordatorios para esta rutina");
            }

            var recordatorio = new Recordatorio
            {
                Descripcion = recordatorioDTO.Descripcion,
                Frecuencia = recordatorioDTO.Frecuencia,
                Hora = recordatorioDTO.Hora,
                DiaSemana = recordatorioDTO.DiaSemana,
                Sonido = recordatorioDTO.Sonido,
                Color = recordatorioDTO.Color,
                Activo = true,
                RutinaId = recordatorioDTO.RutinaId,
                Rutina = rutina
            };

            _context.Recordatorios.Add(recordatorio);
            await _context.SaveChangesAsync();

            // 🚀 PROGRAMAR AUTOMÁTICAMENTE CON HANGFIRE
            await _recordatorioService.ProgramarRecordatorioAsync(recordatorio.Id);

            var recordatorioReadDTO = new RecordatorioReadDTO
            {
                Id = recordatorio.Id,
                Descripcion = recordatorio.Descripcion,
                Frecuencia = recordatorio.Frecuencia,
                Hora = recordatorio.Hora,
                DiaSemana = recordatorio.DiaSemana,
                Sonido = recordatorio.Sonido,
                Color = recordatorio.Color,
                Activo = recordatorio.Activo,
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
            recordatorioExistente.Activo = recordatorioDTO.Activo; // 🆕
            recordatorioExistente.RutinaId = recordatorioDTO.RutinaId;

            await _context.SaveChangesAsync();

            // 🔄 RE-PROGRAMAR CON HANGFIRE
            if (recordatorioDTO.Activo)
            {
                await _recordatorioService.ActualizarProgramacionAsync(id);
            }
            else
            {
                // Si se desactiva, cancelar la programación
                await _recordatorioService.CancelarProgramacionAsync(id);
            }

            return NoContent();
        }

        // DELETE api/recordatorio/eliminarRecordatorio/5
        [HttpDelete("eliminarRecordatorio/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recordatorio = await _context.Recordatorios.FindAsync(id);
            if (recordatorio == null) 
                return NotFound();

            // ❌ CANCELAR PROGRAMACIÓN ANTES DE ELIMINAR
            await _recordatorioService.CancelarProgramacionAsync(id);

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
                    Activo = r.Activo, // 🆕
                    RutinaId = r.RutinaId,
                    RutinaNombre = r.Rutina.Nombre
                })
                .ToListAsync();

            return recordatorios.Any() ? Ok(recordatorios) : NotFound();
        }

        // 📬 Enviar recordatorio programado MANUALMENTE (para pruebas)
        [HttpPost("enviarProgramado/{recordatorioId}")]
        public async Task<IActionResult> EnviarRecordatorioProgramado(int recordatorioId)
        {
            // 🔄 USAR EL SERVICIO EN LUGAR DE CÓDIGO DUPLICADO
            await _recordatorioService.EnviarRecordatorioAsync(recordatorioId);
            return Ok(new { mensaje = $"✅ Recordatorio enviado manualmente" });
        }

        // 🔄 Re-programar todos los recordatorios activos (útil después de reiniciar servidor)
        [HttpPost("reprogramarTodos")]
        public async Task<IActionResult> ReprogramarTodos()
        {
            var recordatoriosActivos = await _context.Recordatorios
                .Where(r => r.Activo)
                .ToListAsync();

            foreach (var recordatorio in recordatoriosActivos)
            {
                await _recordatorioService.ProgramarRecordatorioAsync(recordatorio.Id);
            }

            return Ok(new { 
                mensaje = $"✅ {recordatoriosActivos.Count} recordatorios reprogramados" 
            });
        }

        // 🎯 Activar/Desactivar recordatorio
        [HttpPatch("toggleActivo/{id}")]
        public async Task<IActionResult> ToggleActivo(int id)
        {
            var recordatorio = await _context.Recordatorios.FindAsync(id);
            if (recordatorio == null)
                return NotFound();

            recordatorio.Activo = !recordatorio.Activo;
            await _context.SaveChangesAsync();

            if (recordatorio.Activo)
            {
                await _recordatorioService.ProgramarRecordatorioAsync(id);
            }
            else
            {
                await _recordatorioService.CancelarProgramacionAsync(id);
            }

            return Ok(new { 
                mensaje = recordatorio.Activo 
                    ? "✅ Recordatorio activado y programado" 
                    : "⏸️ Recordatorio desactivado" 
            });
        }

        // 🧹 Limpiar jobs huérfanos de Hangfire
        [HttpPost("limpiarJobsHuerfanos")]
        public async Task<IActionResult> LimpiarJobsHuerfanos()
        {
            var recordatoriosIds = await _context.Recordatorios
                .Where(r => !string.IsNullOrEmpty(r.HangfireJobId))
                .Select(r => new { r.Id, r.HangfireJobId })
                .ToListAsync();

            int jobsEliminados = 0;

            // Intentar eliminar todos los jobs de recordatorios que ya no existen
            // Recorrer IDs del 1 al 1000 (ajusta según tu caso)
            for (int i = 1; i <= 1000; i++)
            {
                var jobId = $"recordatorio_{i}";
                
                // Si el ID no existe en la BD, intentar eliminarlo de Hangfire
                if (!recordatoriosIds.Any(r => r.Id == i))
                {
                    try
                    {
                        RecurringJob.RemoveIfExists(jobId);
                        jobsEliminados++;
                    }
                    catch
                    {
                        // Ignorar errores si el job no existe
                    }
                }
            }

            return Ok(new { 
                mensaje = $"🧹 Se intentó limpiar jobs del 1 al 1000. Operación completada." 
            });
        }
    }
}
