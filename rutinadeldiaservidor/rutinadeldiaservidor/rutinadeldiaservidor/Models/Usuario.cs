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

        public string TelegramChatId { get; set; } 

        //campos de verificación para Telegram
        public bool TelegramVerified { get; set; }       
        public bool EmailVerified { get; set; } 
        public bool PhoneVerified { get; set; }  public bool EmailVerified { get; set; }       public bool PhoneVerified { get; set; } 
        
        public virtual Adulto Adulto { get; set; }
        public virtual ICollection<Infante> Infantes { get; set; }
        public virtual ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();

    }
}
