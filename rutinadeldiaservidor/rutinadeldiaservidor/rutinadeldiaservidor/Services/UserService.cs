using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using rutinadeldiaservidor.Models;
using rutinadeldiaservidor.DTOs;
using Microsoft.Extensions.Logging;

namespace rutinadeldiaservidor.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserService> _logger;
        private readonly VerificationCodeService _verificationCodeService;
        private readonly TelegramService _telegramService;

        public UserService(
            ApplicationDbContext context,
            IConfiguration configuration,
            ILogger<UserService> logger,
            VerificationCodeService verificationCodeService,
            TelegramService telegramService)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _verificationCodeService = verificationCodeService;
            _telegramService = telegramService;
        }

        public async Task<Usuario> GetUserByTelegramChatId(string chatId)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.TelegramChatId == chatId);
        }

        public async Task<Usuario> GetUserByContact(string contactType, string contact)
        {
            if (contactType == "email")
                return await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == contact);
            else if (contactType == "phone")
                return await _context.Usuarios.FirstOrDefaultAsync(u => u.Telefono == contact);
            else
                return null;
        }


        public async Task<Usuario> CreateUserFromTelegram(Update update)
        {
            var newUser = new Usuario
            {
                TelegramChatId = update.Message.Chat.Id.ToString(),
                TelegramVerified = false,
                EmailVerified = false,
                PhoneVerified = false,
                
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _context.Usuarios.AddAsync(newUser);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation($"Nuevo usuario creado con ID: {newUser.Id} y TelegramChatId: {newUser.TelegramChatId}");
            
            return newUser;
        }

        public async Task<bool> VerifyContact(string contactType, string contact, string code)
        {
            var user = await GetUserByContact(contactType, contact);
            if (user == null)
            {
                _logger.LogWarning($"Intento de verificación con contacto no existente: {contactType} = {contact}");
                return false;
            }

            var key = $"{contactType}_{contact}";
            if (_verificationCodeService.TryGetValue(key, out string storedCode) && storedCode == code)
            {
                
                if (contactType == "email")
                {
                    user.EmailVerified = true;
                }
                else if (contactType == "phone")
                {
                    user.PhoneVerified = true;
                }

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Contacto verificado exitosamente: {contactType} = {contact}");
                return true;
            }

            _logger.LogWarning($"Código de verificación incorrecto para {contactType} = {contact}");
            return false;
        }

        public async Task SendNotificationToAdult(int userId, string message)
        {
            var user = await _context.Usuarios.FindAsync(userId);
            if (user == null)
            {
                _logger.LogError($"Usuario no encontrado para ID: {userId}");
                return;
            }

            if (!user.TelegramVerified)
            {
                _logger.LogWarning($"Intento de enviar notificación a usuario no verificado: {userId}");
                return;
            }

            try
            {
                await _telegramService.SendMessage(user.TelegramChatId, message);
                _logger.LogInformation($"Notificación enviada a usuario {userId}: {message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al enviar notificación a usuario {userId}");
            }
        }

        public async Task<List<Notificacion>> GetPendingNotifications(int userId)
        {
            return await _context.Notificaciones
                .Where(n => n.UserId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task MarkNotificationAsRead(int notificationId)
        {
            var notification = await _context.Notificaciones.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                notification.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Notificacion> CreateNotification(int userId, string message)
        {
            var notification = new Notificacion
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Notificaciones.AddAsync(notification);
            await _context.SaveChangesAsync();
            
            return notification;
        }
    }
}