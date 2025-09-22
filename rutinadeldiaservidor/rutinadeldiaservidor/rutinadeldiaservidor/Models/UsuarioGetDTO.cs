namespace rutinadeldiaservidor.Models
{
    public class UsuarioGetDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public int PinAdulto { get; set; }
        public List<string> Infantes { get; set; } = new List<string>();
    }
}
