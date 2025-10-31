using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Models;
using System.Globalization;

namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MetricaController : ControllerBase
    {
        private readonly RutinaContext _context;

        public MetricaController(RutinaContext context)
        {
            _context = context;
        }

        // GET: api/Metricas/rendimientoProceso/5
        [HttpGet("rendimientoProceso/{infanteId}")]
        public async Task<ActionResult<RendimientoProcesoDTO>> ObtenerRendimientoProceso(int infanteId)
        {
            // Contar motivaciones (rutinas completadas)
            var rutinasCompletadas = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .CountAsync();

            // Contar cancelaciones con join optimizado
            var rutinasCanceladas = await _context.Cancelaciones
                .Where(c => c.rutinaID != null)
                .Join(_context.Rutinas.Where(r => r.InfanteId == infanteId),
                    c => c.rutinaID,
                    r => r.Id,
                    (c, r) => c)
                .CountAsync();

            var totalRutinas = rutinasCompletadas + rutinasCanceladas;

            if (totalRutinas == 0)
                return NotFound("Este infante aún no tiene registros de rutinas.");

            var rendimiento = (double)rutinasCompletadas / totalRutinas * 100;

            var dto = new RendimientoProcesoDTO
            {
                InfanteId = infanteId,
                TotalRutinas = totalRutinas,
                RutinasCompletadas = rutinasCompletadas,
                RutinasCanceladas = rutinasCanceladas,
                Rendimiento = Math.Round(rendimiento, 2)
            };

            return Ok(dto);
        }

        // GET: api/Metricas/rendimientoProgresion/5?tipo=semanal
        [HttpGet("rendimientoProgresion/{infanteId}")]
        public async Task<ActionResult<RendimientoProgresionDTO>> ObtenerRendimientoProgresion(
            int infanteId, [FromQuery] string tipo = "semanal")
        {
            if (tipo != "semanal" && tipo != "mensual")
                return BadRequest("El parámetro 'tipo' debe ser 'semanal' o 'mensual'.");

            // Obtenemos motivaciones (rutinas completadas)
            var motivaciones = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .Select(m => m.Fecha)
                .ToListAsync();

            // Obtenemos cancelaciones con join optimizado
            var cancelaciones = await _context.Cancelaciones
                .Where(c => c.rutinaID != null)
                .Join(_context.Rutinas.Where(r => r.InfanteId == infanteId),
                    c => c.rutinaID,
                    r => r.Id,
                    (c, r) => c.fechaHora)
                .ToListAsync();

            if (!motivaciones.Any() && !cancelaciones.Any())
                return NotFound("No hay registros de rutinas para este infante.");

            List<RendimientoPeriodoDTO> periodos;

            if (tipo == "semanal")
            {
                periodos = CalcularRendimientoSemanal(motivaciones, cancelaciones);
            }
            else // mensual
            {
                periodos = CalcularRendimientoMensual(motivaciones, cancelaciones);
            }

            var dto = new RendimientoProgresionDTO
            {
                InfanteId = infanteId,
                Tipo = tipo,
                Periodos = periodos
            };

            return Ok(dto);
        }

        private List<RendimientoPeriodoDTO> CalcularRendimientoSemanal(
            List<DateTime> motivaciones, List<DateTime> cancelaciones)
        {
            // Agrupamos motivaciones por año ISO y semana
            var motivacionesPorSemana = motivaciones
                .GroupBy(f => new { Year = ISOWeek.GetYear(f), Week = ISOWeek.GetWeekOfYear(f) })
                .ToDictionary(g => g.Key, g => g.Count());

            // Agrupamos cancelaciones por año ISO y semana
            var cancelacionesPorSemana = cancelaciones
                .GroupBy(f => new { Year = ISOWeek.GetYear(f), Week = ISOWeek.GetWeekOfYear(f) })
                .ToDictionary(g => g.Key, g => g.Count());

            // Obtenemos todas las semanas únicas (de ambas listas)
            var todasLasSemanas = motivacionesPorSemana.Keys
                .Union(cancelacionesPorSemana.Keys)
                .OrderBy(k => k.Year)
                .ThenBy(k => k.Week);

            var periodos = new List<RendimientoPeriodoDTO>();

            foreach (var semana in todasLasSemanas)
            {
                var completadas = motivacionesPorSemana.GetValueOrDefault(semana, 0);
                var canceladas = cancelacionesPorSemana.GetValueOrDefault(semana, 0);
                var total = completadas + canceladas;
                var rendimiento = total > 0 ? (double)completadas / total * 100 : 0;

                periodos.Add(new RendimientoPeriodoDTO
                {
                    Periodo = $"Semana {semana.Week} ({semana.Year})",
                    RutinasCompletadas = completadas,
                    RutinasCanceladas = canceladas,
                    Rendimiento = Math.Round(rendimiento, 2)
                });
            }

            return periodos;
        }

        private List<RendimientoPeriodoDTO> CalcularRendimientoMensual(
            List<DateTime> motivaciones, List<DateTime> cancelaciones)
        {
            // Agrupamos motivaciones por año y mes
            var motivacionesPorMes = motivaciones
                .GroupBy(f => new { f.Year, f.Month })
                .ToDictionary(g => g.Key, g => g.Count());

            // Agrupamos cancelaciones por año y mes
            var cancelacionesPorMes = cancelaciones
                .GroupBy(f => new { f.Year, f.Month })
                .ToDictionary(g => g.Key, g => g.Count());

            // Obtenemos todos los meses únicos (de ambas listas)
            var todosLosMeses = motivacionesPorMes.Keys
                .Union(cancelacionesPorMes.Keys)
                .OrderBy(k => k.Year)
                .ThenBy(k => k.Month);

            var periodos = new List<RendimientoPeriodoDTO>();

            foreach (var mes in todosLosMeses)
            {
                var completadas = motivacionesPorMes.GetValueOrDefault(mes, 0);
                var canceladas = cancelacionesPorMes.GetValueOrDefault(mes, 0);
                var total = completadas + canceladas;
                var rendimiento = total > 0 ? (double)completadas / total * 100 : 0;

                periodos.Add(new RendimientoPeriodoDTO
                {
                    Periodo = $"{mes.Year}-{mes.Month:D2}",
                    RutinasCompletadas = completadas,
                    RutinasCanceladas = canceladas,
                    Rendimiento = Math.Round(rendimiento, 2)
                });
            }

            return periodos;
        }
    }
}