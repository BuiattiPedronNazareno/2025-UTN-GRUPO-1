using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using rutinadeldiaservidor.Models;
using rutinadeldiaservidor.DTOs;
using rutinadeldiaservidor.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Telegram.Bot.Types;
using Telegram.Bot;
using rutinadeldiaservidor.Data;


namespace rutinadeldiaservidor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TelegramController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService; 
        private readonly VerificationCodeService _verificationCodeService;
        private readonly TelegramService _telegramService;
        private readonly RutinaContext _context;
        private readonly TemporalVerificationCodeService _temporalCodeService;
        private readonly ILogger<TelegramController> _logger; 

        public TelegramController(
            HttpClient httpClient, 
            IConfiguration configuration,
            IUserService userService,
            VerificationCodeService verificationCodeService,
            TelegramService telegramService,
            RutinaContext context, 
            TemporalVerificationCodeService temporalCodeService,
            ILogger<TelegramController> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _userService = userService;
            _verificationCodeService = verificationCodeService;
            _telegramService = telegramService;
            _context = context;
            _temporalCodeService = temporalCodeService;
            _logger = logger;
        }


        [HttpPost("verify")]
        public async Task<IActionResult> VerifyContact([FromBody] VerifyContactDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ContactType) || 
                string.IsNullOrWhiteSpace(dto.Contact))
            {
                return BadRequest("ContactType y Contact son obligatorios");
            }

            var user = await _userService.GetUserByContact(dto.ContactType, dto.Contact);
            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            var code = GenerateVerificationCode();
            
            var key = $"{dto.ContactType}_{dto.Contact}";
            _verificationCodeService.Set(key, code);

            var message = $"Tu código de verificación es: {code}";
            var success = await _httpClient.PostAsync(
                $"https://api.telegram.org/bot{_configuration["TelegramBot:Token"]}/sendMessage",
                new StringContent(
                    $"{{\"chat_id\":\"{user.TelegramChatId}\",\"text\":\"{message}\"}}",
                    Encoding.UTF8,
                    "application/json"));

            if (success.IsSuccessStatusCode)
            {
                return Ok(new { success = true, message = "Código enviado" });
            }

            return BadRequest(new { success = false, message = "Error al enviar código" });
        }

        [HttpPost("send-help")]
        public async Task<IActionResult> SendHelpNotification([FromBody] HelpNotificationRequest request)
        {
            var user = await _context.Usuarios.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound();
            }

            Console.WriteLine("ENVIANDO AYUDA A CHAT ID: " + user.TelegramChatId);

            await _telegramService.SendMessage(
                user.TelegramChatId, 
                $"¡Atención! Solicitud de ayuda de un niño.");

            return Ok(new { success = true });
        }

        [HttpPost("send-cancel")]
        public async Task<IActionResult> SendCancelNotification([FromBody] CancelNotificationRequest request)
        {
            var user = await _context.Usuarios.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound();
            }

            await _telegramService.SendMessage(
                user.TelegramChatId, 
                $"¡Atención! Rutina cancelada por un niño.");

            return Ok(new { success = true });
        }

        private async Task SendMessageToTelegram(string chatId, string message)
        {
            var url = $"https://api.telegram.org/bot{_configuration["TelegramBot:Token"]}/sendMessage";

            var payload = new
            {
                chat_id = long.Parse(chatId), 
                text = message
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            var resp = await response.Content.ReadAsStringAsync();
            Console.WriteLine("RESPUESTA TELEGRAM:");
            Console.WriteLine(resp);
        }

        private async Task StartVerificationProcess(Usuario user, string contactType)
        {
            var code = GenerateVerificationCode();
            
            var key = $"{contactType}_{user.Telefono}";
            _verificationCodeService.Set(key, code);

            var message = $"Tu código de verificación es: {code}";
            await _telegramService.SendMessage(user.TelegramChatId, message);
        }

        private string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(1000, 9999).ToString();
        }

        [HttpPost("send-help-detailed")]
        public async Task<IActionResult> SendHelpDetailed([FromBody] HelpNotificationDetailedRequest request)
        {
            _logger.LogInformation($"🔔 Solicitud de ayuda - InfanteId: {request.InfanteId}, RoutineId: {request.RoutineId}");
            var infante = await _context.Infantes
                .Include(i => i.Usuario) 
                .FirstOrDefaultAsync(i => i.Id == request.InfanteId);
            if (infante == null) {
                _logger.LogWarning($"❌ Infante no encontrado - ID: {request.InfanteId}");
                return NotFound("Infante no encontrado.");
            }

            _logger.LogInformation($"✅ Infante: {infante.Nombre} (ID: {infante.Id}, UsuarioId: {infante.UsuarioId})");

            var adulto = infante.Usuario;
            if (adulto == null){
                _logger.LogError($"❌ Usuario no encontrado para InfanteId: {request.InfanteId}");
                return NotFound("Adulto responsable no encontrado.");
            }

            _logger.LogInformation($"✅ Adulto: {adulto.Email} (ID: {adulto.Id}, ChatId: {adulto.TelegramChatId ?? "NULL"})");

            if (string.IsNullOrEmpty(adulto.TelegramChatId)){
                _logger.LogWarning($"⚠️ Adulto {adulto.Email} sin Telegram vinculado");
                return BadRequest("El adulto responsable no ha vinculado Telegram.");
            }
            if (!adulto.TelegramVerified){
                _logger.LogWarning($"⚠️ Adulto {adulto.Email} sin verificar Telegram");
                return BadRequest("El adulto responsable no ha verificado su cuenta de Telegram.");
            }

            string mensaje;
    
            if (request.RoutineId != 0)
            {
                var rutina = await _context.Rutinas.FindAsync(request.RoutineId);
                string rutinaNombre = rutina?.Nombre ?? "rutina desconocida";
                
                mensaje = $"🆘 ¡{infante.Nombre} necesita ayuda!\n\n" +
                        $"📋 En la Rutina: \"{rutinaNombre}\"";
                
                _logger.LogInformation($"📋 Ayuda solicitada desde rutina: {rutinaNombre} (ID: {request.RoutineId})");
            }
            else
            {
                mensaje = $"🆘 ¡{infante.Nombre} necesita ayuda!";
                
                _logger.LogInformation($"🏠 Ayuda solicitada sin rutina específica");
            }

            try
            {
                await _telegramService.SendMessage(adulto.TelegramChatId, mensaje);
                
                _logger.LogInformation(
                    $"✅ Notificación enviada - Infante: {infante.Nombre} (ID: {infante.Id}) → " +
                    $"Adulto: {adulto.Email} (ID: {adulto.Id}, ChatID: {adulto.TelegramChatId})");

                return Ok(new { 
                    success = true, 
                    message = "Notificación de ayuda enviada al adulto responsable.",
                    tipoAyuda = request.RoutineId != 0 ? "rutina_especifica" : "general",
                    debug = new {
                        infanteId = infante.Id,
                        infanteNombre = infante.Nombre,
                        adultoId = adulto.Id,
                        adultoEmail = adulto.Email,
                        adultoChatId = adulto.TelegramChatId,
                        rutinaId = request.RoutineId
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"❌ Error al enviar mensaje - Adulto ID: {adulto.Id}");
                return StatusCode(500, "Error al enviar notificación de ayuda.");
            }
        }


        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook([FromBody] Update update)
        {
            if (update?.Message?.Text == null) return Ok();

            var chatId = update.Message.Chat.Id.ToString();
            var code = update.Message.Text.Trim();

            // Buscar usuario por código
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.CodigoVerificacion == code && u.CodigoExpira > DateTime.UtcNow);

            if (usuario != null)
            {
                usuario.TelegramChatId = chatId;
                usuario.TelegramVerified = true;
                usuario.CodigoVerificacion = null;
                await _context.SaveChangesAsync();

                await _telegramService.SendMessage(chatId, $"¡Bienvenido {usuario.Email}! Ahora recibirás notificaciones de tus niños.");

                return Ok();
            }

            await _telegramService.SendMessage(chatId, "Código inválido o expirado. Intenta nuevamente.");
            return Ok();
        }


        private string FindUserIdByVerificationCode(string codeToFind)
        {
            foreach (var kvp in _temporalCodeService.GetAllCodes()) 
            {
                if (kvp.Value.Code == codeToFind && DateTime.UtcNow < kvp.Value.Expiry)
                {
                    if (_temporalCodeService.TryGetAndRemoveCode(kvp.Key, out _))
                    {
                        Console.WriteLine($"[VERIFICACIÓN] Código encontrado y removido: {codeToFind} para clave: {kvp.Key}");
                        return kvp.Key; 
                    }
                    else
                    {
                        Console.WriteLine($"[VERIFICACIÓN] Código encontrado pero no se pudo remover inmediatamente: {codeToFind}");
                        return kvp.Key;
                    }
                }
            }
            return null; 
        }

    }
}