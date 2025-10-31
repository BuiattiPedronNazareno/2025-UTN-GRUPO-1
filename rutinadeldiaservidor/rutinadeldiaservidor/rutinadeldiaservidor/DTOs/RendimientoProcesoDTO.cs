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
        public string Periodo { get; set; } = string.Empty; // Semana o mes
        public int RutinasCompletadas { get; set; }
        public int RutinasCanceladas { get; set; }
        public double Rendimiento { get; set; }
    }

    public class RendimientoProgresionDTO
    {
        public int InfanteId { get; set; }
        public string Tipo { get; set; } = string.Empty; // "semanal" o "mensual"
        public List<RendimientoPeriodoDTO> Periodos { get; set; } = new();
    }


}
