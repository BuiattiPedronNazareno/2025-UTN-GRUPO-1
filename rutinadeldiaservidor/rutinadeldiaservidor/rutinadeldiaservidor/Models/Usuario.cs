using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class Usuario
    {
        [Key, Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Clave { get; set; }  

        [Required]
        public string Email { get; set; }

        [Required]
        public string Telefono { get; set; }
        public bool HasSeenAdultTutorial { get; set; } = false;

        public string? TelegramChatId { get; set; } 
        public bool TelegramVerified { get; set; } = false;
        public bool EmailVerified { get; set; } = false; 
        public bool PhoneVerified { get; set; } = false; 

        public string? CodigoVerificacion { get; set; }  
        public DateTime? CodigoExpira { get; set; }     
        public bool Verificado { get; set; } = false; 
        
        public virtual Adulto Adulto { get; set; }
        public virtual ICollection<Infante> Infantes { get; set; }
        public virtual ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


    }
}
