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
            var rutinasCompletadas = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .CountAsync();

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

            var motivaciones = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .Select(m => m.Fecha)
                .ToListAsync();

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
            else
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

        // GET: api/Metricas/racha/5
        [HttpGet("racha/{infanteId}")]
        public async Task<ActionResult<RachaDTO>> ObtenerRacha(int infanteId)
        {
            var motivaciones = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .OrderBy(m => m.Fecha)
                .Select(m => m.Fecha.Date)
                .Distinct()
                .ToListAsync();

            if (!motivaciones.Any())
                return NotFound("Este infante no tiene rutinas completadas.");

            int rachaActual = 0;
            int mejorRacha = 0;
            int rachaTemp = 1;

            for (int i = 1; i < motivaciones.Count; i++)
            {
                if ((motivaciones[i] - motivaciones[i - 1]).Days == 1)
                {
                    rachaTemp++;
                }
                else
                {
                    mejorRacha = Math.Max(mejorRacha, rachaTemp);
                    rachaTemp = 1;
                }
            }
            mejorRacha = Math.Max(mejorRacha, rachaTemp);

            var hoy = DateTime.Today;
            var ultimaCompletacion = motivaciones.Last();

            if ((hoy - ultimaCompletacion).Days <= 1)
            {
                rachaActual = rachaTemp;
            }

            var dto = new RachaDTO
            {
                InfanteId = infanteId,
                RachaActual = rachaActual,
                MejorRacha = mejorRacha,
                UltimaCompletacion = ultimaCompletacion
            };

            return Ok(dto);
        }

        // GET: api/Metricas/rendimientoPorRutina/5
        [HttpGet("rendimientoPorRutina/{infanteId}")]
        public async Task<ActionResult<List<RendimientoPorRutinaDTO>>> ObtenerRendimientoPorRutina(int infanteId)
        {
            var rutinas = await _context.Rutinas
                .Where(r => r.InfanteId == infanteId)
                .ToListAsync();

            if (!rutinas.Any())
                return NotFound("Este infante no tiene rutinas creadas.");

            var resultado = new List<RendimientoPorRutinaDTO>();

            foreach (var rutina in rutinas)
            {
                var completadas = await _context.Motivaciones
                    .Where(m => m.RutinaId == rutina.Id)
                    .CountAsync();

                var canceladas = await _context.Cancelaciones
                    .Where(c => c.rutinaID == rutina.Id)
                    .CountAsync();

                var total = completadas + canceladas;

                if (total == 0) continue;

                var rendimiento = (double)completadas / total * 100;

                var ultimaCompletacion = await _context.Motivaciones
                    .Where(m => m.RutinaId == rutina.Id)
                    .OrderByDescending(m => m.Fecha)
                    .Select(m => m.Fecha)
                    .FirstOrDefaultAsync();

                resultado.Add(new RendimientoPorRutinaDTO
                {
                    RutinaId = rutina.Id,
                    NombreRutina = rutina.Nombre,
                    VecesCompletada = completadas,
                    VecesCancelada = canceladas,
                    Rendimiento = Math.Round(rendimiento, 2),
                    UltimaCompletacion = ultimaCompletacion
                });
            }

            return Ok(resultado.OrderByDescending(r => r.Rendimiento).ToList());
        }

        // GET: api/Metricas/tasaMejora/5?tipo=semanal
        [HttpGet("tasaMejora/{infanteId}")]
        public async Task<ActionResult<TasaMejoraDTO>> ObtenerTasaMejora(
            int infanteId, [FromQuery] string tipo = "semanal")
        {
            if (tipo != "semanal" && tipo != "mensual")
                return BadRequest("El parámetro 'tipo' debe ser 'semanal' o 'mensual'.");

            var motivaciones = await _context.Motivaciones
                .Where(m => m.InfanteId == infanteId)
                .Select(m => m.Fecha)
                .ToListAsync();

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
            else
            {
                periodos = CalcularRendimientoMensual(motivaciones, cancelaciones);
            }

            if (periodos.Count < 2)
                return NotFound("No hay suficientes datos para calcular la tasa de mejora.");

            var periodoAnterior = periodos[periodos.Count - 2];
            var periodoActual = periodos[periodos.Count - 1];

            var mejora = periodoActual.Rendimiento - periodoAnterior.Rendimiento;
            string tendencia;

            if (mejora > 5)
                tendencia = "Mejorando";
            else if (mejora < -5)
                tendencia = "Descendiendo";
            else
                tendencia = "Estable";

            var dto = new TasaMejoraDTO
            {
                InfanteId = infanteId,
                PeriodoAnterior = periodoAnterior.Rendimiento,
                PeriodoActual = periodoActual.Rendimiento,
                Mejora = Math.Round(mejora, 2),
                Tendencia = tendencia,
                NombrePeriodoAnterior = periodoAnterior.Periodo,
                NombrePeriodoActual = periodoActual.Periodo
            };

            return Ok(dto);
        }

        private List<RendimientoPeriodoDTO> CalcularRendimientoSemanal(
            List<DateTime> motivaciones, List<DateTime> cancelaciones)
        {
            var motivacionesPorSemana = motivaciones
                .GroupBy(f => new { Year = ISOWeek.GetYear(f), Week = ISOWeek.GetWeekOfYear(f) })
                .ToDictionary(g => g.Key, g => g.Count());

            var cancelacionesPorSemana = cancelaciones
                .GroupBy(f => new { Year = ISOWeek.GetYear(f), Week = ISOWeek.GetWeekOfYear(f) })
                .ToDictionary(g => g.Key, g => g.Count());

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
            var motivacionesPorMes = motivaciones
                .GroupBy(f => new { f.Year, f.Month })
                .ToDictionary(g => g.Key, g => g.Count());

            var cancelacionesPorMes = cancelaciones
                .GroupBy(f => new { f.Year, f.Month })
                .ToDictionary(g => g.Key, g => g.Count());

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