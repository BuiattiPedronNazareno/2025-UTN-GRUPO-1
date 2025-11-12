using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using System.Net.Http;
using System.Text;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RutinaIAController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RutinaIAController> _logger;
        private readonly RutinaContext _context;
        private readonly HttpClient _httpClient;

        public RutinaIAController(IConfiguration configuration, ILogger<RutinaIAController> logger, RutinaContext context, HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _context = context;
            _httpClient = httpClient;
        }

        [HttpPost("generar")]
        public async Task<ActionResult<RutinaIAResponse>> GenerarRutina([FromBody] RutinaIARequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Idea))
                    return BadRequest(new { error = "La idea de la rutina es requerida" });

                if (request.InfanteId <= 0)
                    return BadRequest(new { error = "El infante es requerido" });

                // Verificar que el infante existe
                var infante = await _context.Infantes.FindAsync(request.InfanteId);
                if (infante == null)
                    return NotFound(new { error = "Infante no encontrado" });

                var apiKey = _configuration["Google:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                    return StatusCode(500, new { error = "Google API Key no configurada" });

                var prompt = $@"Eres un experto en rutinas infantiles. Genera una rutina para la siguiente idea ingresada por el adulto responsable: '{request.Idea}'

Las imágenes disponibles son: bañarse.jpg, child-brushing-teeth-happily.jpg, corner.jpg, hacer-panqueques.jpg, happy-child-eating-at-table-with-utensils.jpg, jabon.jpg, lavarse-las-manos.jpg, plato.jpg, toalla.jpg, vestirse.jpg

Responde SOLO en JSON válido (sin markdown, sin explicaciones):
{{
    ""nombre"": ""Nombre corto de la rutina"",
    ""imagenR"": ""nombre-imagen.jpg"",
    ""pasos"": [
        {{
            ""orden"": 1,
            ""descripcion"": ""Descripción del paso"",
            ""imagen"": ""nombre-imagen.jpg""
        }}
    ]
}}

Genera entre 3 y 7 pasos. 
IMPORTANTE: Usa SOLO imágenes de la lista de disponibles. Elige la imagen que mejor se adapte a cada paso y a la rutina general. Cada paso y el nombre de la rutina debe ser amigable para un infante, no demasiado especifico o rudo.";

                // 👇 LLAMAR A GEMINI API
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };

                var jsonContent = new StringContent(
                    JsonConvert.SerializeObject(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(url, jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Error en Gemini API: {response.StatusCode} - {errorContent}");
                    return StatusCode(500, new { error = "Error al conectar con Gemini API", details = errorContent });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var geminiResponse = JsonConvert.DeserializeObject<dynamic>(responseContent);

                var jsonResponse = geminiResponse["candidates"][0]["content"]["parts"][0]["text"];
                _logger.LogInformation($"Respuesta de Gemini: {jsonResponse}");

                // 👇 CONVERTIR A STRING PRIMERO
                string jsonResponseString = jsonResponse.ToString();

                // Limpiar markdown si existe
                var jsonLimpio = jsonResponseString
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();

                // Parsear JSON
                var jObject = JObject.Parse(jsonLimpio);
                var nombreRutina = jObject["nombre"]?.Value<string>() ?? "Rutina sin nombre";
                var imagenRutina = jObject["imagenR"]?.Value<string>() ?? "rutina sin imagen";
                var pasos = jObject["pasos"]?.ToObject<List<PasoIADTO>>();

                if (pasos == null || pasos.Count == 0)
                    return BadRequest(new { error = "No se pudieron generar pasos válidos" });

                // 👇 CREAR LA RUTINA EN LA BD
                var nuevaRutina = new Rutina
                {
                    Nombre = nombreRutina,
                    Imagen = imagenRutina,
                    InfanteId = request.InfanteId,
                    Estado = "Activa",
                    FechaCreacion = DateTime.UtcNow
                };

                _context.Rutinas.Add(nuevaRutina);
                await _context.SaveChangesAsync();

                // 👇 CREAR LOS PASOS Y ASIGNARLOS A LA RUTINA
                foreach (var paso in pasos)
                {
                    var nuevoPaso = new Paso
                    {
                        Descripcion = paso.Descripcion,
                        Imagen = paso.Imagen,
                        Orden = paso.Orden,
                        RutinaId = nuevaRutina.Id,
                        Audio = "default-audio.mp3", // 👈 AGREGAR ESTO
                        Estado = "Activo" //
                    };

                    _context.Pasos.Add(nuevoPaso);
                }

                await _context.SaveChangesAsync();

                // RETORNAR LA RUTINA CREADA
                var response_final = new RutinaIAResponse
                {
                    Id = nuevaRutina.Id,
                    Nombre = nuevaRutina.Nombre,
                    Imagen = nuevaRutina.Imagen,
                    InfanteId = (int)nuevaRutina.InfanteId,
                    Pasos = pasos
                };

                return Ok(response_final);
            }
            catch (JsonException ex)
            {
                _logger.LogError($"Error al parsear JSON: {ex.Message}");
                return StatusCode(500, new { error = "Error al procesar la respuesta de IA", details = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generando rutina: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Error al generar la rutina", details = ex.Message });
            }
        }
    }
}