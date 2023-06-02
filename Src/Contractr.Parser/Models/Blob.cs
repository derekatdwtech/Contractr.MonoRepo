using System;
using System.IO;

namespace Contractr.Parser.Models
{
    public class BlobOperationResponse
    {
        public string Status { get; set; }
        public bool Error { get; set; } = false;
        public Blob Blob { get; set; }

        public BlobOperationResponse()
        {
            Blob = new Blob();
        }

    }

    public class Blob
    {
        public string Uri { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }
        public Stream Content { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}