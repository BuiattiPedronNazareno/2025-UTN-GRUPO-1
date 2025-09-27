using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rutinadeldiaservidor.Models
{
    public class Recordatorio
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }  // PK
        
        public required string Descripcion { get; set; }
        public required string Frecuencia { get; set; }
        public required string Hora { get; set; }
        public required string DiaSemana { get; set; }
        public required string Sonido { get; set; }
        public required string Color { get; set; }
        
        // 🔑 FK hacia Rutina
        [ForeignKey("Rutina")]
        public int RutinaId { get; set; }
        
        // Propiedad de navegación - Requerida (un recordatorio siempre pertenece a una rutina)
        public required Rutina Rutina { get; set; }
    }
}
