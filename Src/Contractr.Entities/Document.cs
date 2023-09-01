using System;

namespace Contractr.Entities
{

    public abstract class BaseDocument : BaseEntity
    {
        public string? blob_uri { get; set; }
        public string? deal_id { get; set; }
        public string? file_name { get; set; }
        public string parent_document { get; set; }

    }

    public class OriginalDocument : BaseDocument
    {

        public ConvertedDocument convertedDocument { get; set; }
        public List<SignaturePage> signaturePages { get; set; } = new List<SignaturePage>();
        public List<SignedDocument> signedDocuments { get; set; } = new List<SignedDocument>();
        public DateTime uploaded_on { get; set; }
        public string? uploaded_by { get; set; }
    }

    public class ConvertedDocument : BaseDocument
    {

    }

    public class SignaturePage : BaseDocument
    {
    }

    public class SignedDocument : BaseDocument
    {
        public string? signed_by { get; set; }
    }

    public class DocumentDto
    {
        public OriginalDocument originalDocument { get; set; }

    }

}