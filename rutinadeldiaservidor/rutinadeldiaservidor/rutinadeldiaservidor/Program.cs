using rutinadeldiaservidor.Services;
using SignalRReminder.Hubs;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;

namespace rutinadeldiaservidor
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<RutinaContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpClient();

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<VerificationCodeService>();
            builder.Services.AddSingleton<TemporalVerificationCodeService>(); // Singleton para almacenamiento simple en memoria
            builder.Services.AddScoped<TelegramService>();

            // 1. Configurar CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173", "http://localhost")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            builder.Services.AddSignalR();

            builder.Services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(options =>
                    options.UseNpgsqlConnection(
                        builder.Configuration.GetConnectionString("DefaultConnection")),
                    new PostgreSqlStorageOptions
                    {
                        QueuePollInterval = TimeSpan.FromSeconds(1), // 🔄 CAMBIAR ESTO (era TimeSpan.Zero)
                        PrepareSchemaIfNecessary = true,
                        SchemaName = "hangfire"
                    }));
            builder.Services.AddHangfireServer();

            // 🆕 Registrar servicio
            builder.Services.AddScoped<IRecordatorioService, RecordatorioService>();

            var app = builder.Build();

            app.UseHangfireDashboard("/hangfire");


            // ✅ UseCors debe ir ANTES de otros middlewares
            app.UseCors("AllowReactApp");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            app.UseAuthorization();
            app.MapControllers();
            app.MapHub<RemindersHub>("/remindersHub");

            // para hacer mas aestetic los logs
            app.Use(async (context, next) =>
{
    var start = DateTime.Now;

    await next(); // deja que la request siga su curso

    var elapsed = DateTime.Now - start;
    var method = context.Request.Method;
    var path = context.Request.Path;
    var status = context.Response.StatusCode;

    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {method} {path} → {status} ({elapsed.TotalMilliseconds} ms)");
});


            app.Run();
        }
    }
}
