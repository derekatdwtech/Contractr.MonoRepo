using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Contractr.Converter.Config;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace Contractr.Converter.Services
{
    public class BlobStorage : IBlobStorage
    {
        private readonly ILogger<BlobStorage> _log;

        private IOptions<BlobStorageConfiguration> Options {get;}

        public BlobStorage(IOptions<BlobStorageConfiguration> options, ILogger<BlobStorage> log)
        {
            Options = options;
            _log = log;
        }

        private BlobServiceClient GetBlobClient()
        {
            return new BlobServiceClient(Options.Value.ConnectionString);
        }
        public async Task<BlobClient> UploadFileFromPath(string containerName, string source, string destinationFile)
        {
            BlobContainerClient _container = await GetContainerClient(containerName);
            BlobClient blobClient = _container.GetBlobClient(destinationFile);
            await blobClient.UploadAsync(source).ConfigureAwait(false);
            return blobClient;

        }

        public async Task DownloadAsync(string container, string blobFilename, string outputDirectory)
        {
            // Get a reference to a container named in appsettings.json
            BlobContainerClient client = await GetContainerClient(container);

            try
            {
                // Get a reference to the blob uploaded earlier from the API in the container from configuration settings
                BlobClient file = client.GetBlobClient(blobFilename);

                // Check if the file exists in the container
                if (await file.ExistsAsync())
                {
                    _log.LogInformation($"Downloading file {file.Name}");
                    
                    // The filename is already unescaped in the Worker, so we can use it directly
                    string outputPath = Path.Combine(outputDirectory, Path.GetFileName(blobFilename));

                    using (var fileStream = File.OpenWrite(outputPath))
                    {
                        await file.DownloadToAsync(fileStream);
                    }
                }
            }
            catch (RequestFailedException ex)
                when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
            {
                _log.LogError($"File {blobFilename} was not found.");
            }
        }

        private async Task<BlobContainerClient> GetContainerClient(string containerName)
        {
            BlobServiceClient _client = GetBlobClient();
            try
            {
                BlobContainerClient _container = GetBlobClient().GetBlobContainerClient(containerName);
                await _container.CreateIfNotExistsAsync();
                return _container;
            }
            catch (Exception e)
            {
                throw e;
                //return e.StackTrace;
            }
        }
    }
}