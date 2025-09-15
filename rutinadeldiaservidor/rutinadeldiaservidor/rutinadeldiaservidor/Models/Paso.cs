using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Paso
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int Orden { get; set; }  

        [Required]
        public string Descripcion { get; set; }

        public string Estado { get; set; } = "Activo"; 

        public string Imagen { get; set; }

        public string Audio { get; set; }

        // Relación con Rutina
        [ForeignKey("Rutina")]
        public int RutinaId { get; set; }
        public Rutina Rutina { get; set; }
    }
}
