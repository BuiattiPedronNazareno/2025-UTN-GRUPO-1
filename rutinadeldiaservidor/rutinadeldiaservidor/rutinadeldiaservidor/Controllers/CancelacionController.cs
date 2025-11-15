using Microsoft.AspNetCore.Mvc;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Services;
using System;
using rutinadeldiaservidor.DTOs;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CancelacionController : ControllerBase
    {
        private readonly RutinaContext _context;
        private readonly TelegramService _telegramService;

        public CancelacionController(RutinaContext context, TelegramService telegramService)
        {
            _context = context;
            _telegramService = telegramService;
        }

        // GET api/cancelacion/obtenerCancelaciones
        [HttpGet("obtenerCancelaciones")]
        public async Task<ActionResult<IEnumerable<CancelacionReadDTO>>> GetAll()
        {

            await CleanupCancelacionesViejas();
            var hace30dias = DateTime.UtcNow.AddDays(-30);

            var cancelaciones = await _context.Cancelaciones
                .Where(c => c.fechaHora >= hace30dias)
                .Select(c => new CancelacionReadDTO
                {
                    Id = c.Id,
                    fechaHora = c.fechaHora,
                    rutinaID = c.rutinaID,
                })
                .ToListAsync();

            return Ok(cancelaciones);
        }

        // GET api/cancelacion/obtenerCancelacionesPorUsuario/5
        [HttpGet("obtenerCancelacionesPorUsuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<CancelacionReadDTO>>> GetAllByUser(int usuarioId)
        {
            await CleanupCancelacionesViejas();
            var hace30dias = DateTime.UtcNow.AddDays(-30);

            var cancelaciones = await _context.Cancelaciones
                .Where(c =>
                    c.fechaHora >= hace30dias &&
                    c.rutinaID != null &&
                    _context.Rutinas
                        .Where(r => r.Id == c.rutinaID)
                        .Any(r =>
                            r.InfanteId != null &&
                            _context.Infantes.Any(i => i.Id == r.InfanteId && i.UsuarioId == usuarioId)
                        )
                )
                .Select(c => new CancelacionReadDTO
                {
                    Id = c.Id,
                    fechaHora = c.fechaHora,
                    rutinaID = c.rutinaID
                })
                .ToListAsync();

            return Ok(cancelaciones);
        }

        // GET api/cancelacion/obtenerCancelacionesPorInfante/3
        [HttpGet("obtenerCancelacionesPorInfante/{infanteId}")]
        public async Task<ActionResult<IEnumerable<CancelacionReadDTO>>> GetAllByInfante(int infanteId)
        {
            await CleanupCancelacionesViejas();
            var hace30dias = DateTime.UtcNow.AddDays(-30);

            var cancelaciones = await _context.Cancelaciones
                .Where(c =>
                    c.fechaHora >= hace30dias &&
                    c.rutinaID != null &&
                    _context.Rutinas.Any(r => r.Id == c.rutinaID && r.InfanteId == infanteId)
                )
                .Select(c => new CancelacionReadDTO
                {
                    Id = c.Id,
                    fechaHora = c.fechaHora,
                    rutinaID = c.rutinaID
                })
                .ToListAsync();

            return Ok(cancelaciones);
        }

        // GET api/cancelacion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CancelacionReadDTO>> GetById(int id)
        {
            await CleanupCancelacionesViejas();
            var cancelacion = await _context.Cancelaciones
                .Where(c => c.Id == id)
                .Select(c => new CancelacionReadDTO
                {
                    Id = c.Id,
                    fechaHora = c.fechaHora,
                    rutinaID = c.rutinaID,
                })
                .FirstOrDefaultAsync();

            return cancelacion == null ? NotFound() : Ok(cancelacion);
        }

        // POST: Cancelacion/crearCancelacion
        [HttpPost("crearCancelacion")]
        public async Task<ActionResult<CancelacionReadDTO>> Create(CancelacionCreateDTO cancelacionDTO)
        {

            var cancelacion = new Cancelacion
            {
                fechaHora = cancelacionDTO.fechaHora,
                rutinaID = cancelacionDTO.rutinaID
            };


            _context.Cancelaciones.Add(cancelacion);
            await _context.SaveChangesAsync();

            var cancelacionReadDTO = new CancelacionReadDTO
            {
                Id = cancelacion.Id,
                rutinaID = cancelacion.rutinaID,
                fechaHora = cancelacion.fechaHora

            };

            return CreatedAtAction(nameof(GetById), new { id = cancelacion.Id }, cancelacionReadDTO);
        }

        [HttpPost("cancelar-rutina")]
        public async Task<IActionResult> CancelarRutina([FromBody] CancelarRutinaDTO dto)
        {
            // 1) Verificar que la rutina exista
            var rutina = await _context.Rutinas.FirstOrDefaultAsync(r => r.Id == dto.RutinaId);
            if (rutina == null)
                return NotFound("La rutina no existe.");

            // 2) Verificar que pertenece al infante
            if (rutina.InfanteId != dto.InfanteId)
                return BadRequest("La rutina no pertenece al infante.");

            // 3) Obtener el infante
            var infante = await _context.Infantes.FirstOrDefaultAsync(i => i.Id == dto.InfanteId);
            if (infante == null)
                return NotFound("El infante no existe.");

            // 4) Obtener el adulto responsable del infante
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == infante.UsuarioId);
            if (usuario == null)
                return NotFound("El usuario responsable no existe.");

            // 5) Crear y guardar la cancelación
            var cancelacion = new Cancelacion
            {
                fechaHora = DateTime.UtcNow,
                rutinaID = rutina.Id
            };

            _context.Cancelaciones.Add(cancelacion);
            await _context.SaveChangesAsync();

            // 6) Verificar si tiene activadas las notificaciones
            if (usuario.RecibeNotificacionesCancelacion == false)
                return Ok(new { message = "Cancelación registrada, pero el usuario tiene notificaciones desactivadas." });

            // 7) Verificar si tiene Telegram configurado
            if (string.IsNullOrEmpty(usuario.TelegramChatId))
                return Ok(new { message = "Cancelación registrada, pero el usuario no tiene Telegram configurado." });

            // 8) Enviar notificación
            string mensaje = $"{infante.Nombre} canceló la rutina {rutina.Nombre}";

            await _telegramService.SendMessage(usuario.TelegramChatId, mensaje);

            return Ok(new { message = "Cancelación registrada y notificada correctamente." });
        }

        private async Task CleanupCancelacionesViejas()
        {
            var limite = DateTime.UtcNow.AddDays(-30);

            var cancelacionesViejas = await _context.Cancelaciones
                .Where(c => c.fechaHora < limite)
                .ToListAsync();

            if (cancelacionesViejas.Count > 0)
            {
                _context.Cancelaciones.RemoveRange(cancelacionesViejas);
                await _context.SaveChangesAsync();
            }
        }


    }
}
