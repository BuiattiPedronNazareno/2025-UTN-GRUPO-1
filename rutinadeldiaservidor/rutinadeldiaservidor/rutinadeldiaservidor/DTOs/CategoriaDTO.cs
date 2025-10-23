namespace rutinadeldiaservidor.DTOs
{
    public abstract class CategoriaBaseDTO
    {
        public string Descripcion { get; set; }
    }
    public class CategoriaReadDTO : CategoriaBaseDTO
    {
        public int Id { get; set; }
    }

    public class CategoriaCreateDTO : CategoriaBaseDTO
    {
    }
    
}
