using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Contractr.Entities;
using Microsoft.AspNetCore.Http;

namespace Contractr.Api.Services
{
    public interface IDocument
    {
        Task<OriginalDocument> UploadDocument(IFormFile file, string uploaded_by, string dealId);
        List<OriginalDocument> GetDocuments(string deal_id);
        void DownloadDocument(string deal_id);
        Task<FileInfo> DownloadSignaturePages(string document_id);
        List<SignaturePage> GetSignaturePagesForDocument(string document_id);
    }
}