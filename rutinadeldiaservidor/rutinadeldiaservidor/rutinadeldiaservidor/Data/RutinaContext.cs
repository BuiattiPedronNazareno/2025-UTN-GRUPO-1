using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Models;
using System;

namespace rutinadeldiaservidor.Data
{
    public class RutinaContext : DbContext
    {
        public RutinaContext(DbContextOptions<RutinaContext> options) : base(options) { }
        public DbSet<Rutina> Rutinas { get; set; }
        public DbSet<Paso> Pasos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Rutina>()
                .HasMany(r => r.Pasos)
                .WithOne(p => p.Rutina)
                .HasForeignKey(p => p.RutinaId)
                .OnDelete(DeleteBehavior.Cascade); // si se borra una rutina, se borran los pasos
        }
    }
}
