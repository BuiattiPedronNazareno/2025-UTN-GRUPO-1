using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdultoController : ControllerBase
    {
        private readonly RutinaContext _context;

        public AdultoController(RutinaContext context)
        {
            _context = context;
        }

        // POST api/usuario/validarPin
        [HttpPost("validarPin")]
        public async Task<ActionResult> ValidarPin( int pinIngresado, int usuarioId)
        {
            var adulto = await _context.Adultos.FirstOrDefaultAsync(a => a.Id == usuarioId);
            if (adulto == null)
                return NotFound("Adulto no encontrado");

            if (adulto.Pin != pinIngresado)
                return Unauthorized("PIN incorrecto");

            return Ok("Acceso a visión adulto concedido");
        }
    }
}
