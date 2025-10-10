using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using static rutinadeldiaservidor.DTOs.CategoriaDTO;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly RutinaContext _context;

        public CategoriaController(RutinaContext context)
        {
            _context = context;
        }

        // GET: /Categoria/obtenerCategorias
        [HttpGet("obtenerCategorias")]
        public async Task<ActionResult<IEnumerable<CategoriaReadDTO>>> GetAll()
        {
            var categorias = await _context.Categorias
                .Select(c => new CategoriaReadDTO
                {
                    Id = c.Id,
                    Descripcion = c.Descripcion
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: /Categoria/obtenerCategoria/{id}
        [HttpGet("obtenerCategoria/{id}")]
        public async Task<ActionResult<CategoriaReadDTO>> GetById(int id)
        {
            var categoria = await _context.Categorias
                .Where(c => c.Id == id)
                .Select(c => new CategoriaReadDTO
                {
                    Id = c.Id,
                    Descripcion = c.Descripcion
                })
                .FirstOrDefaultAsync();

            if (categoria == null)
            {
                return NotFound();
            }

            return Ok(categoria);
        }

        // POST: /Categoria/crearCategoria
        [HttpPost("crearCategoria")]
        public async Task<ActionResult<CategoriaReadDTO>> Create([FromBody] CategoriaCreateDTO categoriaDTO)
        {
            if (categoriaDTO == null || string.IsNullOrWhiteSpace(categoriaDTO.Descripcion))
            {
                return BadRequest("La descripción es requerida.");
            }

            var categoria = new Categoria
            {
                Descripcion = categoriaDTO.Descripcion
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            var categoriaReadDTO = new CategoriaReadDTO
            {
                Id = categoria.Id,
                Descripcion = categoria.Descripcion
            };

            return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoriaReadDTO);
        }
    }
}
