namespace Contractr.Entities.Config
{

    public class DatabaseConfiguration
    {
        public string ConnectionString { get; set; }
    }
    public class BlobStorageConfiguration
    {
        public string ConnectionString { get; set; }
    }

    public class ServiceBusConfiguration
    {
        public string StatusQueueSend { get; set; }
        public string DocumentQueueSend { get; set; } // Conversion Queue (Word -> PDF)
        public string DocumentParseQueueSend { get; set;}
    }

    public class Auth0Configuration
    {
        public string Domain { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }
    }

    public class Auth0AuthenticationResponse
    {
        public string access_token { get; set; }
        public int expire_in { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }
    }
}