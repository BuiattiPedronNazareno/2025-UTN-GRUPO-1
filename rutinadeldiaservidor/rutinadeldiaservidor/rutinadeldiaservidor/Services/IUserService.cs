using System.Collections.Generic;
using System.Threading.Tasks;
using rutinadeldiaservidor.Models;
using Telegram.Bot.Types;

namespace rutinadeldiaservidor.Services
{
    public interface IUserService
    {
        Task<Usuario> GetUserByTelegramChatId(string chatId);
        Task<Usuario> GetUserByContact(string contactType, string contact);
        Task<Usuario> CreateUserFromTelegram(Telegram.Bot.Types.Update update);
        Task<bool> VerifyContact(string contactType, string contact, string code);
        Task SendNotificationToAdult(int userId, string message);
        Task<List<Notificacion>> GetPendingNotifications(int userId);
        Task MarkNotificationAsRead(int notificationId);
        Task<Notificacion> CreateNotification(int userId, string message);
    }
}
