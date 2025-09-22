namespace rutinadeldiaservidor.Models
{
    public class UsuarioCreateDTO
    {
        public string Email { get; set; }
        public string Clave { get; set; }
        public string Telefono { get; set; }
        public int Pin { get; set; } // Solo para Adulto
    }
}
