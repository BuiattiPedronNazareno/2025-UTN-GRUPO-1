using System.Collections.Concurrent;

namespace rutinadeldiaservidor.Services
{
    public class VerificationCodeService
    {
        private readonly ConcurrentDictionary<string, string> _codes = new();
        private readonly TimeSpan _codeExpiration = TimeSpan.FromMinutes(10);

        public void Set(string key, string code)
        {
            _codes[key] = code;
            Task.Delay(_codeExpiration).ContinueWith(t => 
            {
                if (_codes.TryRemove(key, out _))
                {
                    Console.WriteLine($"Código de verificación expirado para {key}");
                }
            });
        }

        public bool TryGetValue(string key, out string code)
        {
            return _codes.TryGetValue(key, out code);
        }

        public void Remove(string key)
        {
            _codes.Remove(key, out _);
        }
    }
}