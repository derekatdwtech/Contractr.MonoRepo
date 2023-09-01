namespace Contractr.Entities
{
    public class DealTask : BaseEntity
    {
        public string? deal_id { get; set; }
        public string? created_by { get; set; }
        public DateTime created_on { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public string? assigned_to { get; set; }
        public DateTime due_date { get; set; }
        public bool is_restricted { get; set; } = false;
        public int status { get; set; }

    }

    public class TaskComment
    {
        public string task_id { get; set; }
        public string author { get; set; }
        public string body { get; set; }
        public DateTime date { get; set; }

    }
}
