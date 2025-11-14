using System.Collections.Concurrent;

namespace rutinadeldiaservidor.Services
{
    public class TemporalVerificationCodeService
    {
        private readonly ConcurrentDictionary<string, (string Code, DateTime Expiry)> _codes = new();

        public void StoreCode(string userIdKey, string code, TimeSpan validityPeriod)
        {
            var expiry = DateTime.UtcNow.Add(validityPeriod);
            _codes[userIdKey] = (code, expiry);
        }

        public bool TryGetAndRemoveCode(string userIdKey, out string code)
        {
            code = null;
            if (_codes.TryGetValue(userIdKey, out var stored) && DateTime.UtcNow < stored.Expiry)
            {
                code = stored.Code;
                _codes.TryRemove(userIdKey, out _); 
                return true;
            }
            return false;
        }

        public IEnumerable<KeyValuePair<string, (string Code, DateTime Expiry)>> GetAllCodes()
        {
            foreach (var key in _codes.Keys.ToList())
            {
                if (_codes.TryGetValue(key, out var value))
                {
                    yield return new KeyValuePair<string, (string Code, DateTime Expiry)>(key, value);
                }
            }
        }
    }
}