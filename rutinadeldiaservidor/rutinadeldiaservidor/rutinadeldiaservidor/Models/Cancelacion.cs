using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace rutinadeldiaservidor.Models
{
    public class Cancelacion
    {
        [Key, Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public DateTime fechaHora { get; set; }

        [ForeignKey("Rutina")]
        public int? rutinaID { get; set; }
        
        public virtual Rutina? Rutina { get; set; }

    }
}
