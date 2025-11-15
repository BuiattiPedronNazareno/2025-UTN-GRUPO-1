using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rutinadeldiaservidor.Models
{
    public class Recordatorio
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string Descripcion { get; set; }
        public required string Frecuencia { get; set; } // "Diaria" o "Semanal"
        public required string Hora { get; set; } // "09:30" formato HH:mm
        public required string DiaSemana { get; set; } // "0" a "6" (0=Domingo)
        public required string Sonido { get; set; }
        public required string Color { get; set; }

        // 🆕 AGREGAR ESTOS DOS CAMPOS
        public bool Activo { get; set; } = true;
        public string? HangfireJobId { get; set; }

        [ForeignKey("Rutina")]
        public int RutinaId { get; set; }

        public required Rutina Rutina { get; set; }
    }
}
