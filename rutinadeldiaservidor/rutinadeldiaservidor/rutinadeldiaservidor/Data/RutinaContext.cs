using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Models;
using System;

namespace rutinadeldiaservidor.Data
{
    public class RutinaContext : DbContext
    {
        public RutinaContext(DbContextOptions<RutinaContext> options) : base(options) { }
        public DbSet<Rutina> Rutinas { get; set; }
    }
}
