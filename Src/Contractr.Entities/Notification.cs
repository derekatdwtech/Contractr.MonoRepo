namespace Contractr.Entities
{
    public class Notification
    {
        public class NotificationMessage
        {
            public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: Contractr.Entities.NanoidConstants.NANOID_CHARS);
            public string message_text { get; set; }
            public DateTime date_sent { get; set; }
            public bool is_read { get; set; }
            public string type { get; set; }
        }
    }
}