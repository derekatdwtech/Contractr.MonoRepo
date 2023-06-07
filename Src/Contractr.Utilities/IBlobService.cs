using Contractr.Entities;
using Microsoft.AspNetCore.Http;

namespace Contractr.Utilities
{
    public interface IBlobService
    {
        Task UploadFileFromPath(string containerName, string filePath);
        Task<BlobOperationResponse> UploadFileFromStream(string containerName, IFormFile file, string subDirectory = null);
        Task DownloadBlob(string container, string remoteFilePath, string localFilePath);
    }
}