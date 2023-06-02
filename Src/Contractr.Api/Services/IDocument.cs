using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Contractr.Entities;
using Microsoft.AspNetCore.Http;

namespace Contractr.Api.Services {
    public interface IDocument {
        Task<Document> UploadDocument(IFormFile file, string uploaded_by, string dealId);
        List<Document> GetDocuments(string deal_id);
        void DownloadDocument(string deal_id);
        Task<FileInfo> DownloadSignaturePages(string document_id);
        List<SignaturePages> GetSignaturePagesForDocument(string document_id);
    }
}