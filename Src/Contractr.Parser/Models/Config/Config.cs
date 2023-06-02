namespace Contractr.Parser.Config
{

    public class BlobStorageConfiguration
    {
        public string ConnectionString { get; set; }
    }

    public class DatabaseConfiguration {
        public string ConnectionString {get; set;}
    }

    public class ServiceBusConfiguration
    {
        public string DocumentParseQueueListen { get; set; }
        public string NotificationQueueSend { get; set; }
    }


}