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
    public class RutinaController : ControllerBase
    {
        private readonly RutinaContext _context;

        public RutinaController(RutinaContext context)
        {
            _context = context;
        }

        // GET api/rutina/obtenerRutinas
        [HttpGet("obtenerRutinas")]
        public async Task<ActionResult<IEnumerable<RutinaReadDTO>>> GetAll()
        {
            var rutinas = await _context.Rutinas
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen,
                    Estado = r.Estado,
                    CategoriaId = r.CategoriaId,
                    InfanteId = r.InfanteId
                })
                .ToListAsync();

            return Ok(rutinas);
        }

        // GET api/rutina/obtenerRutina/5
        [HttpGet("obtenerRutina/{id}")]
        public async Task<ActionResult<RutinaReadDTO>> GetById(int id)
        {
            var rutina = await _context.Rutinas
                .Where(r => r.Id == id)
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen,
                    Estado = r.Estado,
                    CategoriaId = r.CategoriaId,
                    InfanteId = r.InfanteId
                })
                .FirstOrDefaultAsync();

            return rutina == null ? NotFound() : Ok(rutina);
        }

        // GET api/rutina/obtenerRutina/5
        [HttpGet("obtenerRutinaInfante/{id}")]
        public async Task<ActionResult<IEnumerable<RutinaReadDTO>>> GetByUserId(int id)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.InfanteId == id)
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen,
                    Estado = r.Estado,
                    CategoriaId = r.CategoriaId,
                    InfanteId = r.InfanteId
                })
                .ToListAsync();

            return rutinas == null ? NotFound() : Ok(rutinas);
        }

        // POST: Rutina/crearRutina
        [HttpPost("crearRutina")]
        public async Task<ActionResult<RutinaReadDTO>> Create(RutinaCreateDTO rutinaDTO)
        {

            var rutina = new Rutina
            {
                Nombre = rutinaDTO.Nombre,
                Imagen = rutinaDTO.Imagen,
                Estado = "Activa",
                FechaCreacion = DateTime.UtcNow, // fecha actual 
                InfanteId = rutinaDTO.InfanteId,
                CategoriaId = rutinaDTO.CategoriaId
            };


            _context.Rutinas.Add(rutina);
            await _context.SaveChangesAsync();

            var rutinaReadDTO = new RutinaReadDTO
            {
                Id = rutina.Id,
                Nombre = rutina.Nombre,
                Imagen = rutina.Imagen,
                InfanteId = rutina.InfanteId,
                CategoriaId = rutina.CategoriaId,
            };

            return CreatedAtAction(nameof(GetById), new { id = rutina.Id }, rutinaReadDTO);
        }

        // PUT api/rutina/actualizarRutina/5
        [HttpPut("actualizarRutina/{id}")]
        public async Task<IActionResult> Update(int id, RutinaUpdateDTO rutinaDTO)
        {
            var rutinaExistente = await _context.Rutinas.FindAsync(id);
            if (rutinaExistente == null)
                return NotFound();

            rutinaExistente.Nombre = rutinaDTO.Nombre;
            rutinaExistente.Estado = rutinaDTO.Estado;
            rutinaExistente.Imagen = rutinaDTO.Imagen;
            rutinaExistente.InfanteId = rutinaDTO.InfanteId;
            rutinaExistente.CategoriaId = rutinaDTO.CategoriaId;

            await _context.SaveChangesAsync();
            return Ok(rutinaExistente);
        }

        // PUT api/rutina/cambiarEstadoRutina
        [HttpPut("cambiarVisibilidadRutina/{id}")]
        public async Task<IActionResult> UpdateState(int id, RutinaEstadoUpdateDTO rutinaDTO)
        {
            var rutinaExistente = await _context.Rutinas.FindAsync(id);
            if (rutinaExistente == null)
                return NotFound();
         
            rutinaExistente.Estado = rutinaDTO.Estado;

            await _context.SaveChangesAsync();
            return Ok(rutinaExistente);
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
        public async Task<ActionResult<IEnumerable<RutinaReadDTO>>> GetByStatus(string estado)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.Estado.ToLower() == estado.ToLower())
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen
                })
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

        // GET: api/rutina/porFecha?fecha=2025-09-08
        [HttpGet("porFecha")]
        public async Task<ActionResult<IEnumerable<RutinaReadDTO>>> GetByDate([FromQuery] DateTime fecha)
        {
            // Defino inicio y fin del día
            var fechaIniUtc = DateTime.SpecifyKind(fecha.Date, DateTimeKind.Utc);
            var finUtc = fechaIniUtc.AddDays(1);

            var rutinas = await _context.Rutinas
                .Where(r => r.FechaCreacion >= fechaIniUtc && r.FechaCreacion < finUtc)
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen
                })
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

        // GET: api/rutina/porNombre/Lavarse los dientes
        [HttpGet("porNombre/{nombre}")]
        public async Task<ActionResult<IEnumerable<RutinaReadDTO>>> GetByName(string nombre)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.Nombre.ToLower() == nombre.ToLower())
                .Select(r => new RutinaReadDTO
                {
                    Id = r.Id,
                    Nombre = r.Nombre,
                    Imagen = r.Imagen
                })
                .ToListAsync();

            return rutinas.Any() ? Ok(rutinas) : NotFound();
        }

    }
}
