namespace SignalRReminder.Services
{
    public static class ConnectionStore
    {
        // userId → lista de connectionIds
        public static readonly Dictionary<string, List<string>> Connections = new();
    }
}
