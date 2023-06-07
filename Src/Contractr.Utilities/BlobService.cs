using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Contractr.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Contractr.Utilities
{
    public class BlobService : IBlobService
    {

        private readonly ILogger<BlobService> _log;

        private string _connectionString;
        public BlobService(string connectionString)
        {
            _connectionString = connectionString;
        }

        private BlobServiceClient GetBlobClient()
        {
            return new BlobServiceClient(_connectionString);
        }

        public async Task UploadFileFromPath(string containerName, string filePath)
        {
            BlobContainerClient _container = await GetContainerClient(containerName);
            BlobClient blobClient = _container.GetBlobClient(Path.GetFileName(filePath));
            await blobClient.UploadAsync(filePath);
        }

        public async Task<BlobOperationResponse> UploadFileFromStream(string containerName, IFormFile file, string subDirectory = null)
        {
            BlobOperationResponse response = new();
            BlobContainerClient _container = await GetContainerClient(containerName);
            try
            {
                _log.LogInformation($"Starting file upload for {file.FileName}");
                var blockBlob = subDirectory == null ? file.FileName : $"{subDirectory}/{file.FileName}";
                BlobClient _client = _container.GetBlobClient(blockBlob);

                await using (Stream data = file.OpenReadStream())
                {
                    _log.LogInformation($"Uploading file {file.FileName} to {containerName}");
                    await _client.UploadAsync(data);
                }
                response.Status = $"File {file.FileName} Uploaded Successfully to {_client.Uri.AbsoluteUri}";
                response.Error = false;
                response.Blob.Uri = _client.Uri.AbsoluteUri;
                response.Blob.CreatedOn = _client.GetProperties().Value.CreatedOn.DateTime;
                response.Blob.Name = _client.Name;
                _log.LogInformation(response.Status);
            }
            catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobAlreadyExists)
            {

                response.Status = $"File with name {file.FileName} already exists. Please use another name to store your file.";
                response.Error = true;
                _log.LogError($"{response.Status}");
                return response;
            }
            // If we get an unexpected error, we catch it here and return the error message
            catch (RequestFailedException ex)
            {
                // Log error to console and create a new response we can return to the requesting method
                response.Status = $"Unexpected error: {ex.StackTrace}. Check log with StackTrace ID.";
                response.Error = true;
                _log.LogError($"{response.Status}");
                return response;
            }
            return response;
        }

        public async Task DownloadBlob(string container, string remoteFilePath, string localFilePath)
        {

            BlobContainerClient _container = await GetContainerClient(container);
            try
            {
                BlobClient _blob = _container.GetBlobClient(remoteFilePath);
                await _blob.DownloadToAsync(localFilePath);
            }
            catch (DirectoryNotFoundException ex)
            {
                // Let the user know that the directory does not exist
                Console.WriteLine($"Directory not found: {ex.Message}");
            }
        }

        private async Task<BlobContainerClient> GetContainerClient(string containerName)
        {
            BlobServiceClient _client = GetBlobClient();
            try
            {
                _log.LogInformation($"Getting container reference client for container {containerName}");

                BlobContainerClient _container = GetBlobClient().GetBlobContainerClient(containerName);
                await _container.CreateIfNotExistsAsync();
                return _container;
            }
            catch (Exception e)
            {
                _log.LogError($"Failed to get container reference for container {containerName}", e.StackTrace);
                throw e;
            }
        }

    }
}