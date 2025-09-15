using System.ComponentModel.DataAnnotations;

namespace rutinadeldiaservidor.Models
{
    public class PasoCreateDTO
    {
        public string Descripcion { get; set; }

        public string Imagen { get; set; }

        public string Audio { get; set; }

        public int RutinaId { get; set; }  // Asociamos el paso a una rutina
    }
}
