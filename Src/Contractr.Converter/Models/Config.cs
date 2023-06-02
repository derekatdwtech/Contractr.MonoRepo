namespace Contractr.Converter.Config {
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
        public string DocumentQueueListen { get; set; }
        public string DocumentParseQueueSend { get; set; }
        public string StatusQueueSend {get; set;}
    }

}