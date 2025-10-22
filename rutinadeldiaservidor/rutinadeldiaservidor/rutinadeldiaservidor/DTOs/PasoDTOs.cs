namespace rutinadeldiaservidor.DTOs
{
    public abstract class PasoBaseDTO
    {
        public string Descripcion { get; set; }

        public string Imagen { get; set; }

        public string Audio { get; set; }
    }
    public class PasoCreateDTO : PasoBaseDTO
    { 
        public int RutinaId { get; set; }
    }

    public class PasoReadDTO : PasoBaseDTO
    {
        public int Id { get; set; }
        public int Orden { get; set; }
        public string Estado { get; set; }
        public int RutinaId { get; set; }
    }

    public class PasoUpdateDTO : PasoBaseDTO
    {
        public string Estado { get; set; }
    }
}
