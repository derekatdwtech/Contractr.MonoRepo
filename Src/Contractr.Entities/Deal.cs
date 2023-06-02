using System;

namespace Contractr.Entities {
    public class Deal {
        private const string NANOID_CHARS = "-ABCDEFGHIJKLMNPQRSTUVWXYZabcedfghijklmnpqrstuvwxyz0123456789";
        public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: NANOID_CHARS);
        public string unique_name  {get;set;}
        public string description {get; set;}
        public DateTime start_date {get; set;} = DateTime.Now;
        public DateTime? close_date {get; set;}
        public string buyor {get; set;}
        public string seller {get; set;}
        public string organization {get; set;}
        public int deal_status_id {get;set;}
        public string status {get; set;} = "";
    }
}