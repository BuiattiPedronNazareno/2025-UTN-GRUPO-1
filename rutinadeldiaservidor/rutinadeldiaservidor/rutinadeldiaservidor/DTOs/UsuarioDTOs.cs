namespace rutinadeldiaservidor.DTOs
{
    public abstract class UsuarioBaseDTO {
        public string Email { get; set; }
        public string Telefono { get; set; }

    }
    public class UsuarioCreateDTO : UsuarioBaseDTO
    {
        public string Clave { get; set; }
        public int Pin { get; set; } // Solo para Adulto
    }

    public class UsuarioGetDTO : UsuarioBaseDTO 
    {
        public int Id { get; set; }
        public int PinAdulto { get; set; }
        public List<InfanteGetDTO> Infantes { get; set; }

        public bool RecibeNotificacionesCancelacion { get; set; }
    }

    public class UsuarioLoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Clave { get; set; } = string.Empty;
    }
}
