using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PasoController : ControllerBase
    {
        private readonly RutinaContext _context;

        public PasoController(RutinaContext context)
        {
            _context = context;
        }

        // GET: api/Paso/porRutina/5
        [HttpGet("porRutina/{rutinaId}")]
        public async Task<ActionResult<IEnumerable<Paso>>> getByRutinaId(int rutinaId)
        {
            var pasos = await _context.Pasos
                .Where(p => p.RutinaId == rutinaId)
                .OrderBy(p => p.Orden)
                .ToListAsync();

            var pasosDTO = pasos.Select(p => new PasoReadDTO
            {
                Id = p.Id,
                Orden = p.Orden,
                Descripcion = p.Descripcion,
                Estado = p.Estado,
                Imagen = p.Imagen,
                Audio = p.Audio,
                RutinaId = p.RutinaId
            }).ToList();

            return pasosDTO.Any() ? Ok(pasosDTO) : NotFound();
        }

        // POST: api/Paso/crearPaso
        [HttpPost("crearPaso")]
        public async Task<ActionResult<Paso>> Create(PasoCreateDTO pasoDTO)
        {
            var rutina = await _context.Rutinas.FindAsync(pasoDTO.RutinaId);
            if (rutina == null) return NotFound("La rutina no existe");

            // Calcular orden automáticamente
            var orden = await _context.Pasos
                .Where(p => p.RutinaId == pasoDTO.RutinaId)
                .MaxAsync(p => (int?)p.Orden) ?? 0;

            var paso = new Paso
            {
                RutinaId = pasoDTO.RutinaId,
                Descripcion = pasoDTO.Descripcion,
                Imagen = pasoDTO.Imagen,
                Audio = pasoDTO.Audio,
                Orden = orden + 1,
                Estado = "activo"
            };

            _context.Pasos.Add(paso);
            await _context.SaveChangesAsync();

            var pasoReadDTO = new PasoReadDTO
            {
                Id = paso.Id,
                Orden = paso.Orden,
                Descripcion = paso.Descripcion,
                Estado = paso.Estado,
                Imagen = paso.Imagen,
                Audio = paso.Audio,
                RutinaId = paso.RutinaId
            };

            return CreatedAtAction(nameof(getByRutinaId), new { rutinaId = paso.RutinaId }, pasoReadDTO);
        }

        // PUT api/Paso/actualizarPaso/5
        [HttpPut("actualizarPaso/{id}")]
        public async Task<ActionResult> Update(int id, PasoUpdateDTO pasoDTO)
        {
            var paso = await _context.Pasos.FindAsync(id);
            if (paso == null) return NotFound();

            paso.Descripcion = pasoDTO.Descripcion;
            paso.Imagen = pasoDTO.Imagen;
            paso.Audio = pasoDTO.Audio;
            paso.Estado = pasoDTO.Estado;

            await _context.SaveChangesAsync();

            var pasoReadDTO = new PasoReadDTO
            {
                Id = paso.Id,
                Orden = paso.Orden,
                Descripcion = paso.Descripcion,
                Estado = paso.Estado,
                Imagen = paso.Imagen,
                Audio = paso.Audio,
                RutinaId = paso.RutinaId
            };
            return Ok(pasoReadDTO);
        }

        // DELETE: api/Paso/eliminarPaso/5
        [HttpDelete("eliminarPaso/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var paso = await _context.Pasos.FindAsync(id);
            if (paso == null) return NotFound();

            _context.Pasos.Remove(paso);
            await _context.SaveChangesAsync();

            var pasoReadDTO = new PasoReadDTO
            {
                Id = paso.Id,
                Orden = paso.Orden,
                Descripcion = paso.Descripcion,
                Estado = paso.Estado,
                Imagen = paso.Imagen,
                Audio = paso.Audio,
                RutinaId = paso.RutinaId
            };

            return Ok(pasoReadDTO);
        }

    }
}
