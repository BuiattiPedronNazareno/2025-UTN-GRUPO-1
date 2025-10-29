namespace rutinadeldiaservidor.DTOs
{
    public class MotivacionResponseDTO
    {
        public MotivacionReadDTO Motivacion { get; set; }
        public int TotalMotivaciones { get; set; }
        public bool SubioNivel { get; set; }
        public string NuevoNivel { get; set; }
    }
}
