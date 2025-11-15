using Microsoft.AspNetCore.SignalR;
using SignalRReminder.Services;

namespace SignalRReminder.Hubs
{
    public class RemindersHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Request.Query["userId"].ToString();

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("⚠️ Conexión sin userId, se ignora.");
                return;
            }

            lock (ConnectionStore.Connections)
            {
                if (!ConnectionStore.Connections.ContainsKey(userId))
                    ConnectionStore.Connections[userId] = new List<string>();

                ConnectionStore.Connections[userId].Add(Context.ConnectionId);
            }

            Console.WriteLine($"✅ Usuario {userId} conectado con ID {Context.ConnectionId}");

            await Clients.Client(Context.ConnectionId)
                .SendAsync("ReceiveNotification", $"Bienvenido {userId}, estás conectado correctamente ✅");

            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext?.Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                lock (ConnectionStore.Connections)
                {
                    if (ConnectionStore.Connections.TryGetValue(userId, out var connections))
                    {
                        connections.Remove(Context.ConnectionId);
                        if (connections.Count == 0)
                            ConnectionStore.Connections.Remove(userId);
                    }
                }

                Console.WriteLine($"❌ Usuario {userId} desconectado ({Context.ConnectionId})");
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}
