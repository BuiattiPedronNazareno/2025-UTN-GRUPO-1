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
    [Route("api/[controller]")]
    public class TelegramController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService; 
        private readonly VerificationCodeService _verificationCodeService;
        private readonly TelegramService _telegramService;

        private readonly RutinaContext _context;

        public TelegramController(
            HttpClient httpClient, 
            IConfiguration configuration,
            IUserService userService,
            VerificationCodeService verificationCodeService,
            TelegramService telegramService,
            RutinaContext context)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _userService = userService;
            _verificationCodeService = verificationCodeService;
            _telegramService = telegramService;
            _context = context;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> HandleWebhook([FromBody] Update update)
        {
            Console.WriteLine("WEBHOOK RECIBIDO:");
            Console.WriteLine(JsonSerializer.Serialize(update));

            if (update == null || update.Message == null)
                return Ok();

            var chatId = update.Message.Chat.Id.ToString();
            var text = update.Message.Text?.ToLower();

            Console.WriteLine($"CHAT ID = {chatId}");
            Console.WriteLine($"MENSAJE = {text}");

            var user = await _userService.GetUserByTelegramChatId(chatId);

            if (user == null)
            {
                Console.WriteLine("Usuario no existe → creando...");
                user = await _userService.CreateUserFromTelegram(update);
            }

            if (text == "ayuda")
            {
                await SendHelpNotification(new HelpNotificationRequest { UserId = user.Id });
                await SendMessageToTelegram(chatId, "¡Notificación enviada!");
            }
            else if (text == "cancelar")
            {
                await SendCancelNotification(new CancelNotificationRequest { UserId = user.Id });
                await SendMessageToTelegram(chatId, "¡Rutina cancelada!");
            }

            return Ok();
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
    }
}