namespace rutinadeldiaservidor.DTOs
{
    public class RutinaIAResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Imagen { get; set; }
        public int InfanteId { get; set; }
        public List<PasoIADTO> Pasos { get; set; } = new();
    }

    public class PasoIADTO
    {
        public int Orden { get; set; }
        public string Descripcion { get; set; }
        public string Imagen { get; set; }
    }

    public class RutinaIARequest
    {
        public string Idea { get; set; }
        public int InfanteId { get; set; }
    }

}