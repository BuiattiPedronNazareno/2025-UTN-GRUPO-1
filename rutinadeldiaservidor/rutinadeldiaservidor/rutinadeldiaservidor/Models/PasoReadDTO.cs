namespace rutinadeldiaservidor.Models
{
    public class PasoReadDTO
    {
        public int Id { get; set; }
        public int Orden { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public string Imagen { get; set; }
        public string Audio { get; set; }
        public int RutinaId { get; set; }
    }
}
