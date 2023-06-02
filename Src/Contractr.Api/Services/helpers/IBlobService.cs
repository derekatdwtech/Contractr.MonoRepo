using System.Threading.Tasks;
using Contractr.Entities;
using Microsoft.AspNetCore.Http;

namespace Contractr.Api.Services
{
    public interface IBlobService
    {
        Task UploadFileFromPath(string containerName, string filePath);
        Task<BlobOperationResponse> UploadFileFromStream(string containerName, IFormFile file, string subDirectory = null);
        Task DownloadBlob(string container, string remoteFilePath, string localFilePath);
    }
}