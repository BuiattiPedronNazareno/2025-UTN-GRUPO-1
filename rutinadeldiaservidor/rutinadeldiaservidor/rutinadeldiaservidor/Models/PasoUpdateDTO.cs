namespace rutinadeldiaservidor.Models
{
    public class PasoUpdateDTO
    {
        public string Descripcion { get; set; }
        public string Imagen { get; set; }
        public string Audio { get; set; }
        public string Estado { get; set; } // "Activo" o "Oculto"
    }
}
