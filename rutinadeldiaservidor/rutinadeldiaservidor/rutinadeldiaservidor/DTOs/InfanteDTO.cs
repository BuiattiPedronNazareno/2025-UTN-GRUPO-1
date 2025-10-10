namespace rutinadeldiaservidor.DTOs
{
    public class InfanteDTO
    {
        public class InfanteCreateDTO
        {
            public string Nombre { get; set; } = string.Empty;
            public int UsuarioId { get; set; }
            public int InfanteNivelId { get; set; }
        }

        public class InfanteGetDTO
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public int InfanteNivelId { get; set; }
        }

        public class InfanteReadDTO
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public int UsuarioId { get; set; }
            public int InfanteNivelId { get; set; }
        }
    }
}
