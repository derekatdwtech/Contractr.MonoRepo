namespace Contractr.Entities
{

    public class Organization : BaseEntity
    {
        public string name { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country { get; set; }
        public int zip { get; set; }
        public string phone { get; set; }
        public string owner { get; set; } = "";
    }
}