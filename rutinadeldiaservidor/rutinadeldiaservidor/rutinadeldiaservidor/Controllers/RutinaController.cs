using Microsoft.AspNetCore.Mvc;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RutinaController : ControllerBase
    {
        private readonly RutinaContext _context;

        public RutinaController(RutinaContext context)
        {
            _context = context;
        }

        // GET api/rutina/obtenerRutinas
        [HttpGet("obtenerRutinas")]
        public async Task<ActionResult<IEnumerable<Rutina>>> GetAll()
        {
            return await _context.Rutinas.ToListAsync();
        }

        // GET api/rutina/obtenerRutina/5
        [HttpGet("obtenerRutina/{id}")]
        public async Task<ActionResult<Rutina>> GetById(int id)
        {
            var rutina = await _context.Rutinas.FindAsync(id);
            return rutina == null ? NotFound() : Ok(rutina);
        }

        // POST: api/rutina/crearRutina
        [HttpPost("crearRutina")]
        public async Task<ActionResult<Rutina>> Create(Rutina rutina)
        {
            _context.Rutinas.Add(rutina);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = rutina.Id }, rutina);
        }

        // PUT api/rutina/actualizarRutina/5
        [HttpPut("actualizarRutina/{id}")]
        public async Task<IActionResult> Update(int id, Rutina rutina)
        {
            var rutinaExistente = await _context.Rutinas.FindAsync(id);
            if (rutinaExistente == null)
                return NotFound();

            rutinaExistente.Nombre = rutina.Nombre;
            rutinaExistente.Estado = rutina.Estado;
            rutinaExistente.Imagen = rutina.Imagen;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/rutina/eliminarRutina/5
        [HttpDelete("eliminarRutina/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var rutina = await _context.Rutinas.FindAsync(id);
            if (rutina == null) return NotFound();

            _context.Rutinas.Remove(rutina);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/rutina/porEstado/Activa
        [HttpGet("porEstado/{estado}")]
        public async Task<ActionResult<IEnumerable<Rutina>>> GetByStatus(string estado)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.Estado.ToLower() == estado.ToLower())
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

        // GET: api/rutina/porFecha?fecha=2025-09-08
        [HttpGet("porFecha")]
        public async Task<ActionResult<IEnumerable<Rutina>>> GetByDate([FromQuery] DateTime fecha)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.FechaCreacion.Date == fecha.Date)
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

        // GET: api/rutina/porNombre/Lavarse los dientes
        [HttpGet("porNombre/{nombre}")]
        public async Task<ActionResult<IEnumerable<Rutina>>> GetByName(string nombre)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.Nombre.ToLower() == nombre.ToLower())
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

    }
}
