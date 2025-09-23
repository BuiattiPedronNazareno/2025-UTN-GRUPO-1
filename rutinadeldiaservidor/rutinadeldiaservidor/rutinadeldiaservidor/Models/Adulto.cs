using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Adulto
    {
        [Key, ForeignKey("Usuario")] 
        public int Id { get; set; }

        [Required]
        public int Pin { get; set; }

        public virtual Usuario Usuario { get; set; }
    }
}
