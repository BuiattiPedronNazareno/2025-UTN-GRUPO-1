using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace rutinadeldiaservidor.Services
{
    public class TelegramService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public TelegramService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<bool> SendMessage(string chatId, string message)
        {
            var url = $"https://api.telegram.org/bot{ _configuration["TelegramBot:Token"] }/sendMessage";
            var content = new StringContent(
                $"{{\"chat_id\":\"{chatId}\",\"text\":\"{message}\"}}", 
                Encoding.UTF8, 
                "application/json");

            var response = await _httpClient.PostAsync(url, content);
            return response.IsSuccessStatusCode;
        }
    }
}