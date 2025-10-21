namespace rutinadeldiaservidor.Models
{
    public abstract class CancelacionBaseDTO
    {
        public DateTime fechaHora {  get; set; }

        public int rutinaID { get; set; }
    }

    public class CancelacionReadDTO : CancelacionBaseDTO { 
        public int Id{ get; set; }
    }

    public class CancelacionCreateDTO : CancelacionBaseDTO { }


}
