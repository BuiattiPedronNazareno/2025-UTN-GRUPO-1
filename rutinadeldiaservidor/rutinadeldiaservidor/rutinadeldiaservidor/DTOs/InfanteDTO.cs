namespace rutinadeldiaservidor.DTOs
{

    public abstract class InfanteBaseDTO
    {
        public int InfanteNivelId { get; set; }
    }
    public class InfanteCreateDTO : InfanteBaseDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public List<int> CategoriaIds { get; set; } = new();
    }

    public class InfanteGetDTO : InfanteBaseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
    }

    public class InfanteReadDTO : InfanteBaseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int UsuarioId { get; set; }
    }
}

