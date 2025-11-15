using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    // DTO para leer recordatorios (respuesta)
    public class RecordatorioReadDTO
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string Frecuencia { get; set; } = string.Empty;
        public string Hora { get; set; } = string.Empty;
        public string DiaSemana { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int RutinaId { get; set; }
        public string RutinaNombre { get; set; } = string.Empty;
    }

    // DTO para crear recordatorios (entrada)
    public class RecordatorioCreateDTO
    {
        [Required]
        public string Descripcion { get; set; } = string.Empty;
        public string Frecuencia { get; set; } = string.Empty;
        [Required]
        public string Hora { get; set; } = string.Empty;
        public string DiaSemana { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        [Required]
        public int RutinaId { get; set; }
    }

    // DTO para actualizar recordatorios (entrada)
    public class RecordatorioUpdateDTO
    {
        [Required]
        public string Descripcion { get; set; } = string.Empty;
        public string Frecuencia { get; set; } = string.Empty;
        [Required]
        public string Hora { get; set; } = string.Empty;
        public string DiaSemana { get; set; } = string.Empty;
        public string Sonido { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
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
