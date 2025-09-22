using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Infante : Usuario
    {
        [Required]
        public int InfanteNivelId { get; set; }

        [ForeignKey("InfanteNivelId")]
        public virtual InfanteNivel InfanteNivel { get; set; }
    }
}
