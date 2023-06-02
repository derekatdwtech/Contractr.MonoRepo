using System;

namespace Contractr.Parser {
    internal class DocumentMessageDTO {
        public string id { get; set; }
        public string file_name { get; set; }
        public string blob_uri { get; set; }
        public DateTime uploaded_on { get; set; }
        public string uploaded_by { get; set; }
        public string deal_id { get; set; }
    }
}