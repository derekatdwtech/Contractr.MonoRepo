using System;
using System.IO;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Contractr.Parser.Config;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Contractr.Parser.Services
{
    public class BlobStorage : IBlobStorage
    {

        private IOptions<BlobStorageConfiguration> Options {get;}
        private ILogger<BlobStorage> _log;

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
            _log.LogInformation($"Uploading file {source} to container {containerName}");
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
                    Console.WriteLine($" ....... Downloading file {file.Name}");
                    var data = await file.OpenReadAsync();
                    Stream blobContent = data;

                    using (var fileStream = File.OpenWrite($"{outputDirectory}/{blobFilename.Split('/')[2]}"))
                    {
                        // Download the file details async
                        var content = await file.DownloadToAsync(fileStream);
                    }
                }
            }
            catch (RequestFailedException ex)
                when (ex.ErrorCode == BlobErrorCode.BlobNotFound)
            {
                // Log error to console
                Console.WriteLine($" ....... File {blobFilename} was not found.");
            }
            // File does not exist, return null and handle that in requesting method
            return;
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