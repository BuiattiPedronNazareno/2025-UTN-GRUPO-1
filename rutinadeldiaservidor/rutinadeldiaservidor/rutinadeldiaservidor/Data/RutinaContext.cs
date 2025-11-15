using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Models;

namespace rutinadeldiaservidor.Data
{
    public class RutinaContext : DbContext
    {
        public RutinaContext(DbContextOptions<RutinaContext> options) : base(options) { }

        public DbSet<Rutina> Rutinas { get; set; }
        public DbSet<Paso> Pasos { get; set; }
        public DbSet<Recordatorio> Recordatorios { get; set; }
        public DbSet<Cancelacion> Cancelaciones { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Motivacion> Motivaciones { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Infante> Infantes { get; set; }
        public DbSet<InfanteNivel> InfanteNiveles { get; set; }
        public DbSet<Adulto> Adultos { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relaciones existentes
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

            // Configuración de Recordatorio
            modelBuilder.Entity<Recordatorio>()
                .Property(r => r.Hora)
                .HasColumnType("varchar(5)");

            // 🆕 AGREGAR CONFIGURACIÓN PARA NUEVOS CAMPOS
            modelBuilder.Entity<Recordatorio>()
                .Property(r => r.Activo)
                .HasDefaultValue(true);

            modelBuilder.Entity<Recordatorio>()
                .Property(r => r.HangfireJobId)
                .HasMaxLength(100)
                .IsRequired(false);

            // Configuración de Motivacion
            modelBuilder.Entity<Motivacion>()
                .HasOne(m => m.Infante)
                .WithMany(i => i.Motivaciones)
                .HasForeignKey(m => m.InfanteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Motivacion>()
                .HasOne(m => m.Rutina)
                .WithMany(r => r.Motivaciones)
                .HasForeignKey(m => m.RutinaId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
