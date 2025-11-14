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

        public TelegramController(
            HttpClient httpClient, 
            IConfiguration configuration,
            IUserService userService,
            VerificationCodeService verificationCodeService,
            TelegramService telegramService,
            RutinaContext context, 
            TemporalVerificationCodeService temporalCodeService)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _userService = userService;
            _verificationCodeService = verificationCodeService;
            _telegramService = telegramService;
            _context = context;
            _temporalCodeService = temporalCodeService;
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
            var infante = await _context.Infantes.FindAsync(request.InfanteId);
            if (infante == null)
                return NotFound("Infante no encontrado.");

            int userIdResponsable = infante.UsuarioId; 

            var user = await _context.Usuarios.FindAsync(userIdResponsable);
            if (user == null)
                return NotFound("Adulto responsable no encontrado.");

            if (user.TelegramChatId == null)
                return BadRequest("El adulto responsable no tiene Telegram configurado.");

            string rutinaNombre = "rutina actual";
            if (request.RoutineId != 0 && request.RoutineId != null) 
            {
                var rutina = await _context.Rutinas.FindAsync(request.RoutineId);
                if (rutina != null)
                    rutinaNombre = rutina.Nombre;
            }

            string mensaje = $"¡{infante.Nombre} necesita ayuda! En la rutina \"{rutinaNombre}\".";

            await _telegramService.SendMessage(user.TelegramChatId, mensaje);

            Console.WriteLine($"ENVIANDO AYUDA A CHAT ID DEL ADULTO RESPONSABLE ({user.Id}): {user.TelegramChatId}");
            Console.WriteLine($"MENSAJE: {mensaje}");

            return Ok(new { success = true, message = "Notificación de ayuda enviada al adulto responsable." });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook([FromBody] Update update)
        {
            Console.WriteLine("WEBHOOK RECIBIDO:");
            Console.WriteLine(JsonSerializer.Serialize(update));

            if (update?.Message?.Text == null)
                return Ok(); 

            var chatId = update.Message.Chat.Id.ToString(); 
            var text = update.Message.Text.Trim();
            var userIdFromTelegram = update.Message.From?.Id; 

            Console.WriteLine($"MENSAJE RECIBIDO DEL CHAT ID: {chatId}, USER ID: {userIdFromTelegram}, TEXTO: '{text}'");

            var userIdForCode = FindUserIdByVerificationCode(text);

            if (!string.IsNullOrEmpty(userIdForCode))
            {
                if (userIdForCode.StartsWith("telegram_verify_"))
                {
                    var userIdString = userIdForCode.Substring("telegram_verify_".Length);
                    if (int.TryParse(userIdString, out int userId))
                    {
                        var user = await _context.Usuarios.FindAsync(userId);
                        if (user != null)
                        {
                            user.TelegramChatId = chatId; 
                            user.TelegramVerified = true; 

                            await _context.SaveChangesAsync();

                            Console.WriteLine($"[VERIFICACIÓN] Usuario ID {user.Id} verificado. ChatId guardado: {chatId}");

                            await _telegramService.SendMessage(chatId, "¡Tu número ha sido verificado! Ahora recibirás notificaciones de la aplicación.");

                            return Ok();
                        }
                        else
                        {
                            Console.WriteLine($"[VERIFICACIÓN ERROR] Código válido pero usuario ID {userId} no encontrado en DB.");
                            await _telegramService.SendMessage(chatId, "Hubo un error al verificar tu cuenta. Inténtalo de nuevo.");
                            return Ok();
                        }
                    }
                    else
                    {
                        Console.WriteLine($"[VERIFICACIÓN ERROR] Código válido pero userId en clave inválido: {userIdForCode} (valor intentado: {userIdString})");
                        await _telegramService.SendMessage(chatId, "Hubo un error al verificar tu cuenta. Inténtalo de nuevo.");
                        return Ok();
                    }
                }
                else
                {
                    Console.WriteLine($"[VERIFICACIÓN ERROR] Clave encontrada no coincide con el formato esperado: {userIdForCode}");
                    await _telegramService.SendMessage(chatId, "Hubo un error al verificar tu cuenta. Inténtalo de nuevo.");
                    return Ok();
                }
            }

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