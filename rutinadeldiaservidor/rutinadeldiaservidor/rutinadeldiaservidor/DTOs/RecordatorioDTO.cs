using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class RecordatorioReadDTO
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string Frecuencia { get; set; } = string.Empty;
        public string Hora { get; set; } = string.Empty;
        public string DiaSemana { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public bool Activo { get; set; } // 🆕
        public int RutinaId { get; set; }
        public string RutinaNombre { get; set; } = string.Empty;
    }

    public class RecordatorioCreateDTO
    {
        [Required]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        public string Frecuencia { get; set; } = string.Empty; // "Diaria" o "Semanal"

        [Required]
        [RegularExpression(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
            ErrorMessage = "Formato de hora inválido. Use HH:mm (ej: 09:30)")]
        public string Hora { get; set; } = string.Empty; // "09:30"

        // 🔄 CAMBIAR A STRING REQUERIDO CONDICIONALMENTE
        public string DiaSemana { get; set; } = string.Empty; // "0" a "6" (requerido si Frecuencia es "Semanal")

        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        [Required]
        public int RutinaId { get; set; }
    }

    public class RecordatorioUpdateDTO
    {
        [Required]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        public string Frecuencia { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")]
        public string Hora { get; set; } = string.Empty;

        public string DiaSemana { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public bool Activo { get; set; } = true; // 🆕

        [Required]
        public int RutinaId { get; set; }
    }

    public class RecordatorioNotificacionDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string Hora { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public int RutinaId { get; set; }
    }
}

