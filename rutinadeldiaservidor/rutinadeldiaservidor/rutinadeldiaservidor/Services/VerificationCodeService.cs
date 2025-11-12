using System.Collections.Concurrent;

namespace rutinadeldiaservidor.Services
{
    public class VerificationCodeService
    {
        private readonly ConcurrentDictionary<string, string> _codes = new();

        public void Set(string key, string code)
        {
            _codes[key] = code;
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