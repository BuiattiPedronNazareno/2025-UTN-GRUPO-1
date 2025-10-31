using Microsoft.AspNetCore.Mvc;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using Microsoft.EntityFrameworkCore;
using System;
using rutinadeldiaservidor.DTOs;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CancelacionController : ControllerBase
    {
        private readonly RutinaContext _context;

        public CancelacionController(RutinaContext context)
        {
            _context = context;
        }

        // GET api/cancelacion/obtenerCancelaciones
        [HttpGet("obtenerCancelaciones")]
        public async Task<ActionResult<IEnumerable<CancelacionReadDTO>>> GetAll()
        {
            var cancelaciones = await _context.Cancelaciones
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
            var cancelaciones = await _context.Cancelaciones
                .Where(c =>
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
            var cancelaciones = await _context.Cancelaciones
                .Where(c => c.rutinaID != null &&
                            _context.Rutinas.Any(r => r.Id == c.rutinaID && r.InfanteId == infanteId))
                .Select(c => new CancelacionReadDTO
                {
                    Id = c.Id,
                    fechaHora = c.fechaHora,
                    rutinaID = c.rutinaID
                })
                .ToListAsync();

            return Ok(cancelaciones);
        }


        // GET api/Cancelacion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CancelacionReadDTO>> GetById(int id)
        {
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

    }
}
