using System.Threading.Tasks;
using Azure.Storage.Blobs;

namespace Contractr.Parser.Services
{
    public interface IBlobStorage
    {
        Task<BlobClient> UploadFileFromPath(string containerName, string source, string destinationFile);
        Task DownloadAsync(string container, string blobFilename, string outputDirectory);
    }
}