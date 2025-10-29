using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rutinadeldiaservidor.Models
{
    public class Motivacion
    {
        [Key, Required]
        public int Id { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public int RutinaId { get; set; }

        [Required]
        public int InfanteId { get; set; }

        [ForeignKey("RutinaId")]
        public virtual Rutina Rutina { get; set; }

        [ForeignKey("InfanteId")]
        public virtual Infante Infante { get; set; }
    }
}
