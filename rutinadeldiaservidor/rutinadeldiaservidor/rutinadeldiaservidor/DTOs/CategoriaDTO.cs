namespace rutinadeldiaservidor.DTOs
{
    public class CategoriaDTO
    {
        public class CategoriaReadDTO
        {
            public int Id { get; set; }
            public string Descripcion { get; set; }
        }

        public class CategoriaCreateDTO
        {
            public string Descripcion { get; set; }
        }
    }
}
