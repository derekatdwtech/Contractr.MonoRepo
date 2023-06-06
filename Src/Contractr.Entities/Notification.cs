namespace Contractr.Entities
{
    public class Notification
    {
        public class NotificationMessage : BaseEntity
        {
            public string message_text { get; set; }
            public DateTime date_sent { get; set; }
            public bool is_read { get; set; }
            public string type { get; set; }
        }
    }
}