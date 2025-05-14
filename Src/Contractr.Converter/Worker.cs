using Azure.Messaging.ServiceBus;
using Contractr.Converter.Services;
using Contractr.Converter.Utils;
using Contractr.Entities;
using Dapper;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Contractr.Converter
{
    public class Worker : IHostedService
    {
        private IDatabaseProvider _db;
        private IServiceBus _serviceBus;
        private IPdfUtils _pdfUtils;
        private ILogger<Worker> _log;
        private IBlobStorage _blob;
        public Worker(IServiceBus serviceBus, IPdfUtils pdfUtils, IBlobStorage blob, IDatabaseProvider db, ILogger<Worker> log)
        {
            _serviceBus = serviceBus ?? throw new ArgumentNullException(nameof(serviceBus));
            _log = log;
            _pdfUtils = pdfUtils;
            _blob = blob;
            _db = db;
        }
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await _serviceBus.ReceiveDocumentMessage(ProcessServiceBusMessage);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        private async Task ProcessServiceBusMessage(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();

            _log.LogInformation($"Received message {body}");
            if (args.Message.DeliveryCount < 3)
            {
                if (!String.IsNullOrEmpty(body))
                {

                    DocumentMessageDTO message = JsonConvert.DeserializeObject<DocumentMessageDTO>(body);

                    string[] uriSegments = GetUriSegments(message.blob_uri);
                    string container = uriSegments[0];
                    string dealId = uriSegments[1];
                    string documentId = uriSegments[2];
                    string fileName = uriSegments[3];
                    string signaturePageDirectory = $"{message.id}/signature_pages";

                    CreateDirectoryIfNotExists(documentId);

                    var originalDocument = await DownloadOriginalDocument(container, $"{dealId}/{documentId}/{fileName}", documentId);
                
                    if (!String.IsNullOrEmpty(originalDocument.Name))
                    {
                        // STATUS: Received Document
                        PostStatusMessage(message.id, 1);
                        // Convert document to pdf
                        FileInfo convertedDocument = await _pdfUtils.ConvertWordDocumentToPDF(originalDocument, documentId);
                        if (!string.IsNullOrEmpty(convertedDocument.Name))
                        {
                            PostStatusMessage(message.id, 2);
                            BaseDocument convertedDocumentId = await UploadConvertedPDFDocument(container, convertedDocument.FullName, $"{dealId}/{documentId}/{convertedDocument.Name}").ConfigureAwait(false);

                            if(!string.IsNullOrEmpty(convertedDocumentId.id)) {
                                SendDocumentParseMessage(convertedDocumentId);   
                            }
                        }
                    }

                    _log.LogInformation($"Cleaning up after processing. Deleting directory {documentId}");
                    var dir = new DirectoryInfo(documentId);
                    dir.Delete(true);
                }
            }
        }

        private async Task<FileInfo?> DownloadOriginalDocument(string container, string remoteFilePath, string localFilePath)
        {
            try
            {
                // Unescape the remote path once at the start
                string unescapedRemotePath = Uri.UnescapeDataString(remoteFilePath);
                _log.LogInformation($"Downloading original document from {container}/{unescapedRemotePath}");
                
                await _blob.DownloadAsync(container, unescapedRemotePath, localFilePath);
                
                // The downloaded file will have the same name as the remote file
                string downloadedFilePath = Path.Combine(localFilePath, Path.GetFileName(unescapedRemotePath));
                
                if (!File.Exists(downloadedFilePath))
                {
                    return null;
                }
                
                return new FileInfo(downloadedFilePath);
            }
            catch (Exception ex)
            {
                _log.LogError($"Failed to download file from remote source. {ex.Message}");
                return null;
            }
        }


        private void PostStatusMessage(string document_id, int current_status)
        {
            StatusMessage message = new()
            {
                document_id = document_id,
                current_status = current_status,
                updated_date = DateTime.UtcNow
            };

            string body = JsonConvert.SerializeObject(message);
            try
            {
                _serviceBus.SendStatusUpdateMessage(body);
            }
            catch (Exception e)
            {
                _log.LogError("Failed to post status update. ", e);
            }
        }

        private void SendDocumentParseMessage(BaseDocument document)
        {
            
            string body = JsonConvert.SerializeObject(document);
            try
            {
                _log.LogInformation($"Send Document Parse Message. Contents: {body}");
                _serviceBus.SendDocumentParseMessage(body);
            }
            catch (Exception e)
            {
                _log.LogError("Failed to post status update.", e);
            }
        }

        private async Task<BaseDocument> UploadConvertedPDFDocument(string container, string sourceFile, string destinationFile)
        {
            _log.LogInformation($"Uploading converted pdf document {sourceFile}");

            try
            {
                string blobUri = _blob.UploadFileFromPath(container, sourceFile, destinationFile).Result.Uri.ToString();
                try
                {
                    ConvertedDocument document = new()
                    {
                        blob_uri = blobUri,
                        parent_document = destinationFile.Split('/')[1],
                        deal_id = destinationFile.Split('/')[0],
                        file_name = new FileInfo(sourceFile).Name
                    };
                    
                    InsertConvertedDocumentSql(document);
                    return document;
                }
                catch (Exception e)
                {
                    _log.LogError($"Failed to insert converted document to database. Error: {e}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                _log.LogError($"Failed to upload converted PDF file: {sourceFile}. Error: {ex.Message}");
                return null;
            }
        }

        private int InsertConvertedDocumentSql(ConvertedDocument document)
        {
            SqlHelper _helper = new();
            _log.LogInformation($"Inserting {JsonConvert.SerializeObject(document)}");
            string sql = "INSERT INTO converted_documents (id, parent_document, deal_id, file_name, blob_uri) VALUES (@id, @parent_document, @deal_id, @file_name, @blob_uri)";
            DynamicParameters _params = _helper.GetDynamicParameters(document);

            return _db.Insert(sql, _params);
        }
        private string[] GetUriSegments(string input)
        {
            return new Uri(Uri.UnescapeDataString(input)).AbsolutePath.TrimStart('/').Split('/');
        }

        private void CreateDirectoryIfNotExists(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
    }
}