using System;

namespace Contractr.Entities
{
    

    public class Document : BaseEntity
    {
        public string parent_document { get; set; }

        public string file_name { get; set; }
        public string blob_uri { get; set; }
        public DateTime uploaded_on { get; set; }
        public string uploaded_by { get; set; }
        public string deal_id { get; set; }

    }

    public class GenericDocument : BaseEntity
    {
        public string parent_document { get; set; }
        public string file_name {get; set;}
        public string blob_uri { get; set; }
        public string deal_id { get; set; }

    }

    public class SignaturePages : BaseEntity
    {
        public string parent_document { get; set; }
        public string file_name { get; set; }
        public string deal_id { get; set; }
        public string blob_uri { get; set; }
    }



    
}