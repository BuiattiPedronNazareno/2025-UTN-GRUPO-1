namespace rutinadeldiaservidor.Models
{
    public class InfanteCreateDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public int UsuarioId { get; set; }      
        public int InfanteNivelId { get; set; } 
    }
}
