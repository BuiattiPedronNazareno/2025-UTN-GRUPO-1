using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Data
{
    // 🎯 UN SOLO CONTEXTO para todo el dominio de la aplicación
    public class RutinaContext : DbContext
    {
        public RutinaContext(DbContextOptions<RutinaContext> options) : base(options) { }
        
        // 📋 Todas las entidades del dominio "Rutinas"
        public DbSet<Rutina> Rutinas { get; set; }
        public DbSet<Paso> Pasos { get; set; }
        public DbSet<Recordatorio> Recordatorios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        
        // 👥 Entidades del dominio "Usuarios"  
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Infante> Infantes { get; set; }
        public DbSet<InfanteNivel> InfanteNiveles { get; set; }
        public DbSet<Adulto> Adultos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // 🔗 Relaciones del dominio Rutinas
            modelBuilder.Entity<Rutina>()
                .HasMany(r => r.Pasos)
                .WithOne(p => p.Rutina)
                .HasForeignKey(p => p.RutinaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rutina>()
                .HasMany(r => r.Recordatorios)
                .WithOne(rec => rec.Rutina)
                .HasForeignKey(rec => rec.RutinaId)
                .OnDelete(DeleteBehavior.Cascade);

            // 🛠️ Configuraciones específicas
            modelBuilder.Entity<Recordatorio>()
                .Property(r => r.Hora)
                .HasColumnType("varchar(5)"); // Para PostgreSQL: "08:30"
                
            // Aquí puedes agregar más configuraciones de entidades...
        }
    }
}
