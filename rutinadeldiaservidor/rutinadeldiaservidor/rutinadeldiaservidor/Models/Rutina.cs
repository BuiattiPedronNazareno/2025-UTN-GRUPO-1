using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Rutina
    {
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
        public string Estado { get; set; } = "Activa";
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public string Imagen { get; set; }
    }
}
