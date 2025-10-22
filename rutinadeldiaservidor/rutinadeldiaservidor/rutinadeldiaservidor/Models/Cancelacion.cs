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
        public int? rutinaID { get; set; }
        [ForeignKey("Rutina")]
        public virtual Rutina? rutina { get; set; }

    }
}
