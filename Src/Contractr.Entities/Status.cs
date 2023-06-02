namespace Contractr.Entities {
        public class StatusMessage 
    {
        public const int RECEIVED = 1;
        public string document_id { get; set; }
        public int current_status { get; set; }
        public DateTime updated_date {get; set;} 

    }
}