namespace Contractr.Parser.Models
{
    public class GenericDocument
    {
        public string id { get; set; } = Nanoid.Nanoid.Generate(size:16);
        public string parent_document { get; set; }
        public string file_name {get; set;}
        public string blob_uri { get; set; }
        public string deal_id { get; set; }

    }
    public class StatusMessage 
    {
        public const int RECEIVED = 1;
        public string document_id { get; set; }
        public int current_status { get; set; }
    }
}