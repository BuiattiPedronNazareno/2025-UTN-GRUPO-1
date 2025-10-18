using rutinadeldiaservidor.DTOs;
using static rutinadeldiaservidor.DTOs.InfanteDTO;

namespace rutinadeldiaservidor.Models
{
    public class UsuarioGetDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public int PinAdulto { get; set; }
        public List<InfanteGetDTO> Infantes { get; set; }
    }
}
