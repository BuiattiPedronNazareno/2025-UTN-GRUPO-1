using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rutinadeldiaservidor.DTOs
{
    public abstract class InfanteNivelBaseDTO
    {
        public string Descripcion { get; set; }
    }
    public class InfanteNivelCreateDTO : InfanteNivelBaseDTO {}

    public class InfanteNivelGetDTO : InfanteNivelBaseDTO
    {
        public int Id { get; set; }
    }
}

