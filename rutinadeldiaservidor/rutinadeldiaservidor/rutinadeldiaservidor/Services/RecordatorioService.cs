using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using rutinadeldiaservidor.Data;
using rutinadeldiaservidor.Models;
using SignalRReminder.Hubs;
using SignalRReminder.Services;

namespace rutinadeldiaservidor.Services
{
    public class RecordatorioService : IRecordatorioService
    {
        private readonly RutinaContext _context;
        private readonly IHubContext<RemindersHub> _hubContext;
        private readonly ILogger<RecordatorioService> _logger;

        public RecordatorioService(
            RutinaContext context,
            IHubContext<RemindersHub> hubContext,
            ILogger<RecordatorioService> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
        }

        // 📬 Enviar recordatorio
        public async Task EnviarRecordatorioAsync(int recordatorioId)
        {
            try
            {
                var recordatorio = await _context.Recordatorios
                    .Include(r => r.Rutina)
                        .ThenInclude(rutina => rutina.Infante)
                    .FirstOrDefaultAsync(r => r.Id == recordatorioId);

                if (recordatorio == null || recordatorio.Rutina?.Infante == null)
                {
                    _logger.LogWarning($"⚠️ Recordatorio {recordatorioId} no encontrado");
                    return;
                }

                var infanteId = recordatorio.Rutina.Infante.Id.ToString();

                // 🔍 Buscar conexiones activas del usuario usando ConnectionStore
                List<string>? connectionIds = null;

                lock (ConnectionStore.Connections)
                {
                    if (ConnectionStore.Connections.TryGetValue(infanteId, out var connections))
                    {
                        // Crear copia de la lista para usar fuera del lock
                        connectionIds = new List<string>(connections);
                    }
                }

                // Enviar notificaciones fuera del lock
                if (connectionIds != null && connectionIds.Count > 0)
                {
                    var notificacion = new RecordatorioNotificacionDto
                    {
                        Id = recordatorio.Id,
                        Descripcion = recordatorio.Descripcion,
                        Hora = recordatorio.Hora,
                        Sonido = recordatorio.Sonido,
                        Color = recordatorio.Color,
                        RutinaId = recordatorio.RutinaId,
                    };

                    // Enviar a todas las conexiones del usuario
                    foreach (var connectionId in connectionIds)
                    {
                        await _hubContext.Clients.Client(connectionId)
                            .SendAsync("ReceiveNotification", notificacion);
                    }

                    _logger.LogInformation(
                        $"✅ Recordatorio {recordatorioId} enviado a {connectionIds.Count} conexión(es) del infante {infanteId}");
                }
                else
                {
                    _logger.LogInformation(
                        $"⚠️ Infante {infanteId} no tiene conexiones activas para recordatorio {recordatorioId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error al enviar recordatorio {recordatorioId}");
            }
        }

        // 📅 Programar recordatorio
        public async Task ProgramarRecordatorioAsync(int recordatorioId)
        {
            try
            {
                var recordatorio = await _context.Recordatorios
                    .FirstOrDefaultAsync(r => r.Id == recordatorioId);

                if (recordatorio == null || !recordatorio.Activo)
                {
                    _logger.LogWarning($"⚠️ Recordatorio {recordatorioId} no activo o no encontrado");
                    return;
                }

                // Cancelar programación anterior si existe
                if (!string.IsNullOrEmpty(recordatorio.HangfireJobId))
                {
                    RecurringJob.RemoveIfExists(recordatorio.HangfireJobId);
                }

                var jobId = $"recordatorio_{recordatorioId}";
                var cronExpression = GenerarCronExpression(recordatorio);

                if (!string.IsNullOrEmpty(cronExpression))
                {
                    // ⏰ Programar con Hangfire
                    RecurringJob.AddOrUpdate(
                        jobId,
                        () => EnviarRecordatorioAsync(recordatorioId),
                        cronExpression,
                        new RecurringJobOptions
                        {
                            TimeZone = TimeZoneInfo.Local
                        }
                    );

                    recordatorio.HangfireJobId = jobId;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation(
                        $"✅ Recordatorio {recordatorioId} programado con CRON: {cronExpression}");
                }
                else
                {
                    _logger.LogWarning(
                        $"⚠️ No se pudo generar CRON para recordatorio {recordatorioId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error al programar recordatorio {recordatorioId}");
            }
        }

        // 🔄 Actualizar programación
        public async Task ActualizarProgramacionAsync(int recordatorioId)
        {
            await ProgramarRecordatorioAsync(recordatorioId);
        }

        // ❌ Cancelar programación
        public async Task CancelarProgramacionAsync(int recordatorioId)
        {
            try
            {
                var recordatorio = await _context.Recordatorios
                    .FirstOrDefaultAsync(r => r.Id == recordatorioId);

                if (recordatorio != null && !string.IsNullOrEmpty(recordatorio.HangfireJobId))
                {
                    RecurringJob.RemoveIfExists(recordatorio.HangfireJobId);
                    recordatorio.HangfireJobId = null;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation(
                        $"✅ Programación cancelada para recordatorio {recordatorioId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    $"❌ Error al cancelar programación de recordatorio {recordatorioId}");
            }
        }

        // 🕐 Generar expresión CRON desde strings
        private string? GenerarCronExpression(Recordatorio recordatorio)
        {
            if (string.IsNullOrEmpty(recordatorio.Hora))
            {
                _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: Hora vacía");
                return null;
            }

            try
            {
                // Parsear hora "09:30" -> hora=9, minutos=30
                var partes = recordatorio.Hora.Split(':');
                if (partes.Length != 2)
                {
                    _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: Formato de hora inválido '{recordatorio.Hora}'");
                    return null;
                }

                if (!int.TryParse(partes[0], out int hora) ||
                    !int.TryParse(partes[1], out int minutos))
                {
                    _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: No se pudo parsear hora '{recordatorio.Hora}'");
                    return null;
                }

                // Validar rangos
                if (hora < 0 || hora > 23 || minutos < 0 || minutos > 59)
                {
                    _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: Hora fuera de rango '{recordatorio.Hora}'");
                    return null;
                }

                var frecuencia = recordatorio.Frecuencia?.ToLower()?.Trim() ?? "";

                _logger.LogInformation($"🔍 Procesando recordatorio {recordatorio.Id}: Frecuencia='{frecuencia}', Hora='{recordatorio.Hora}', DiaSemana='{recordatorio.DiaSemana}'");

                switch (frecuencia)
                {
                    case "diaria":
                        var cronDiaria = $"{minutos} {hora} * * *";
                        _logger.LogInformation($"✅ CRON Diaria generado: {cronDiaria}");
                        return cronDiaria;

                    case "semanal":
                        // Validar que DiaSemana no esté vacío
                        if (string.IsNullOrWhiteSpace(recordatorio.DiaSemana))
                        {
                            _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: DiaSemana vacío para frecuencia semanal");
                            return null;
                        }

                        // 🆕 Convertir nombre del día a número (0-6) o usar número directamente
                        int dia = ConvertirDiaSemanaNombre(recordatorio.DiaSemana.Trim());

                        if (dia == -1)
                        {
                            _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: DiaSemana no válido '{recordatorio.DiaSemana}'");
                            return null;
                        }

                        var cronSemanal = $"{minutos} {hora} * * {dia}";
                        _logger.LogInformation($"✅ CRON Semanal generado: {cronSemanal} (Día {dia} - {recordatorio.DiaSemana})");
                        return cronSemanal;

                    default:
                        _logger.LogWarning($"⚠️ Recordatorio {recordatorio.Id}: Frecuencia desconocida '{frecuencia}'");
                        return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    $"❌ Error al generar CRON para recordatorio {recordatorio.Id}");
                return null;
            }
        }

        // 🆕 Método helper para convertir nombre de día a número o validar número
        private int ConvertirDiaSemanaNombre(string diaSemana)
        {
            // Normalizar el texto
            var diaLower = diaSemana.ToLower().Trim();

            // Primero intentar parsear como número (por si ya viene así)
            if (int.TryParse(diaLower, out int diaNumero))
            {
                // Validar rango 0-6
                return (diaNumero >= 0 && diaNumero <= 6) ? diaNumero : -1;
            }

            // Si no es número, intentar convertir desde nombre
            // Mapa de nombres a números (CRON usa 0=Domingo, 1=Lunes, ..., 6=Sábado)
            var diasMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                { "domingo", 0 },
                { "lunes", 1 },
                { "martes", 2 },
                { "miércoles", 3 },
                { "miercoles", 3 },  // Sin acento
                { "jueves", 4 },
                { "viernes", 5 },
                { "sábado", 6 },
                { "sabado", 6 }  // Sin acento
            };

            return diasMap.TryGetValue(diaLower, out int valor) ? valor : -1;
        }
    }
}
