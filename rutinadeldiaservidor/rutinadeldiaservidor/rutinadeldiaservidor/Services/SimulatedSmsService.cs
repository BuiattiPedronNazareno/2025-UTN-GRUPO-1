using Microsoft.Extensions.Logging;

namespace rutinadeldiaservidor.Services
{
    public class SimulatedSmsService : ISmsService
    {
        private readonly ILogger<SimulatedSmsService> _logger;

        public SimulatedSmsService(ILogger<SimulatedSmsService> logger)
        {
            _logger = logger;
        }

        public async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            _logger.LogInformation($"[SIMULATED SMS] Enviando SMS al número: {phoneNumber}");
            _logger.LogInformation($"[SIMULATED SMS] Mensaje: {message}");
            Console.WriteLine($"[SIMULATED SMS] Enviando SMS al número: {phoneNumber}");
            Console.WriteLine($"[SIMULATED SMS] Mensaje: {message}");
            await Task.Delay(100);
            return true;
        }
    }
}