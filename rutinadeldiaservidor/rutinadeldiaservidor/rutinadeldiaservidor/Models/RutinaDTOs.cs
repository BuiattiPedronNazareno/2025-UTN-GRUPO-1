namespace rutinadeldiaservidor.Models
{
    // Clase base con lo común
    public abstract class RutinaBaseDTO
    {
        public string Nombre { get; set; }
        public string Imagen { get; set; }
        public int? InfanteId { get; set; }
        public int? CategoriaId { get; set; }
    }

    // Lectura -> hereda lo común y agrega Id
    public class RutinaReadDTO : RutinaBaseDTO
    {
        public int Id { get; set; }
        public string Estado { get; set; }
    }

    // Creación -> solo necesita lo común
    public class RutinaCreateDTO : RutinaBaseDTO
    {
    }

    // Actualización -> hereda lo común y agrega Estado
    public class RutinaUpdateDTO : RutinaBaseDTO
    {
        public string Estado { get; set; }
    }

    // DTO especial para actualizar solo el estado
    public class RutinaEstadoUpdateDTO
    {
        public string Estado { get; set; }
    }
}
