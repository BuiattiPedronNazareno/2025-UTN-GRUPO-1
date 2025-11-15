namespace rutinadeldiaservidor.DTOs
{
    public abstract class CancelacionBaseDTO
    {
        public DateTime fechaHora {  get; set; }

        public int? rutinaID { get; set; }
    }

    public class CancelacionReadDTO : CancelacionBaseDTO { 
        public int Id{ get; set; }
        public DateTime fechaHora { get; set; }
        public int? rutinaID { get; set; }
        public string? nombreRutina { get; set; }  
        public string? nombreInfante { get; set; } 
    }

    public class CancelacionCreateDTO : CancelacionBaseDTO { }


}
