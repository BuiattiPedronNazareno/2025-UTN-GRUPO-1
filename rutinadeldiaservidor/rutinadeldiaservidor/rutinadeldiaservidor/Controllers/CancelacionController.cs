using Microsoft.AspNetCore.Mvc;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using Microsoft.EntityFrameworkCore;
using System;

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

    }
}
