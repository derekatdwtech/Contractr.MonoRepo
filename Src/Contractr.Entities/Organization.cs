namespace Contractr.Api.Services
{

    public class Organization
    {

        public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: Contractr.Entities.NanoidConstants.NANOID_CHARS);
        public string name { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country { get; set; }
        public int zip { get; set; }
        public int phone { get; set; }
        public string owner { get; set; } = "";
    }
}