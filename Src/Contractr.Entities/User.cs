using System;

namespace Contractr.Entities
{
    #nullable enable
    public class User   
    {
        public string id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string email { get; set; }
        public Nullable<bool> is_active { get; set; }
    }
}