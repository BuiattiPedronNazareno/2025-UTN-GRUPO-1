using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rutinadeldiaservidor.Models
{
    public class Rutina
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [BindNever]
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
        public string Estado { get; set; } = "Activa";
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public string Imagen { get; set; }

        // Relación con Infante (opcional)
        public int? InfanteId { get; set; }   // el "?" indica que es opcional (para que entiendan pq está)
        [ForeignKey("InfanteId")]
        public Infante? Infante { get; set; }

        // Relación con Categoria
        public int? CategoriaId { get; set; }
        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; }

        // Relación con pasos
        public ICollection<Paso> Pasos { get; set; }
        // Relación con recordatorios
        public ICollection<Recordatorio>? Recordatorios { get; set; }
        // Relación con Motivaciones
        public virtual ICollection<Motivacion> Motivaciones { get; set; }

    }
}
