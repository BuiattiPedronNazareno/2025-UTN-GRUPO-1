namespace rutinadeldiaservidor.DTOs
{
    public class RendimientoProcesoDTO
    {
        public int InfanteId { get; set; }
        public int TotalRutinas { get; set; }
        public int RutinasCompletadas { get; set; }
        public int RutinasCanceladas { get; set; }
        public double Rendimiento { get; set; }
    }

    public class RendimientoPeriodoDTO
    {
        public string Periodo { get; set; } = string.Empty;
        public int RutinasCompletadas { get; set; }
        public int RutinasCanceladas { get; set; }
        public double Rendimiento { get; set; }
    }

    public class RendimientoProgresionDTO
    {
        public int InfanteId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public List<RendimientoPeriodoDTO> Periodos { get; set; } = new();
    }

    public class RachaDTO
    {
        public int InfanteId { get; set; }
        public int RachaActual { get; set; }
        public int MejorRacha { get; set; }
        public DateTime UltimaCompletacion { get; set; }
    }

    public class RendimientoPorRutinaDTO
    {
        public int RutinaId { get; set; }
        public string NombreRutina { get; set; } = string.Empty;
        public int VecesCompletada { get; set; }
        public int VecesCancelada { get; set; }
        public double Rendimiento { get; set; }
        public DateTime? UltimaCompletacion { get; set; }
    }

    public class TasaMejoraDTO
    {
        public int InfanteId { get; set; }
        public double PeriodoAnterior { get; set; }
        public double PeriodoActual { get; set; }
        public double Mejora { get; set; }
        public string Tendencia { get; set; } = string.Empty;
        public string NombrePeriodoAnterior { get; set; } = string.Empty;
        public string NombrePeriodoActual { get; set; } = string.Empty;
    }
}