using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Infante
    {
        [Key, Required]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; }

        [Required]
        public int InfanteNivelId { get; set; }

        [ForeignKey("InfanteNivelId")]
        public virtual InfanteNivel InfanteNivel { get; set; }
    }
}
