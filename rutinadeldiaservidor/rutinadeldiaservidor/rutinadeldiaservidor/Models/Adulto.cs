using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Adulto : Usuario
    {
        [Required]
        public int Pin { get; set; }
    }
}
