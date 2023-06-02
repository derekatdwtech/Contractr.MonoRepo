using System;

namespace Contractr.Entities
{
    

    public class Document
    {
        public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: Contractr.Entities.NanoidConstants.NANOID_CHARS);
        public string parent_document { get; set; }

        public string file_name { get; set; }
        public string blob_uri { get; set; }
        public DateTime uploaded_on { get; set; }
        public string uploaded_by { get; set; }
        public string deal_id { get; set; }

    }

    public class GenericDocument
    {
        public string id { get; set; } = Nanoid.Nanoid.Generate(size: 16, alphabet: Contractr.Entities.NanoidConstants.NANOID_CHARS);
        public string parent_document { get; set; }
        public string file_name {get; set;}
        public string blob_uri { get; set; }
        public string deal_id { get; set; }

    }

    public class SignaturePages
    {
        public string id { get; set; }
        public string parent_document { get; set; }
        public string file_name { get; set; }
        public string deal_id { get; set; }
        public string blob_uri { get; set; }
    }



    
}