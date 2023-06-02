namespace Contractr.Notification.Api.Config
{

    public class DatabaseConfiguration {
        public string ConnectionString {get; set;}
    }

    public class NotificationQueueConfiguration {
        public string ConnectionString {get; set;}
    }

    public class Auth0Configuration
    {
        public string Domain { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }
    }

}