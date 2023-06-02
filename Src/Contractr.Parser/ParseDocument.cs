using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Contractr.Parser.Models;
using Contractr.Parser.Services;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Contractr.Parser
{

    public class ParseDocument
    {
        private ILogger<ParseDocument> _log;
        private IBlobStorage _blob;
        private IDocumentParser _parser;
        public ParseDocument(IBlobStorage blob, IDocumentParser parser, ILogger<ParseDocument> log)
        {
            _log = log;
            _blob = blob;
            _parser = parser;
        }
        [FunctionName("ParseDocument")]
        public async Task Run([ServiceBusTrigger("document.parse.q", Connection = "DocumentParseQueueListen")] string message)
        {
            _log.LogInformation($"Received message: {message}");

            // Deserialize object.
            GenericDocument document = JsonConvert.DeserializeObject<GenericDocument>(message) ?? throw new System.Exception($"Failed to convert string to object for parsing. Please ensure the message is formed properly and try again. {message}");

            if (!String.IsNullOrEmpty(document.blob_uri))
            {
                string TEMP_PATH = Path.GetTempPath();
                string[] uriSegments = GetUriSegments(document.blob_uri);
                string container = uriSegments[0];
                string dealId = uriSegments[1];
                string documentId = uriSegments[2];
                string fileName = uriSegments[3];
                string signaturePageDirectory = $"{TEMP_PATH}/{document.id}/signature_pages";

                try
                {
                    CreateDirectoryIfNotExists($"{TEMP_PATH}/{document.id}");
                    CreateDirectoryIfNotExists(signaturePageDirectory);
                }
                catch (Exception e)
                {
                    _log.LogError($"Unable to create local directory {signaturePageDirectory}", e.StackTrace);
                    Environment.Exit(1);
                }

                await _blob.DownloadAsync(container, $"{dealId}/{documentId}/{fileName}", $"{TEMP_PATH}/{document.id}").ConfigureAwait(false);
                FileInfo file = new DirectoryInfo($"{TEMP_PATH}/{document.id}").GetFiles()[0];

                try
                {

                    List<FileInfo> pages = _parser.ParseDocument(file, signaturePageDirectory);
                    if (pages.Count > 0)
                    {
                        _log.LogInformation($"Found {pages.Count} signature page(s).");
                        foreach (var page in pages)
                        {
                            var blob = await _blob.UploadFileFromPath(container, page.FullName, $"{dealId}/{document.id}/signature_pages/{page.Name}");
                            GenericDocument gDoc = new GenericDocument()
                            {
                                parent_document = document.id,
                                file_name = page.Name,
                                blob_uri = blob.Uri.ToString(),
                                deal_id = dealId
                            };
                            _log.LogDebug($"Attempting to insert {JsonConvert.SerializeObject(gDoc)}");

                            var rows = _parser.InsertSignaturePagesSql(gDoc);
                            if (rows > 0)
                            {
                                _log.LogInformation($"Successfully inserted document with id {gDoc.id}");
                            }
                            else
                            {
                                _log.LogError($"Failed to insert document. Attempted to insert {JsonConvert.SerializeObject(gDoc)}");
                            }
                        }
                    }
                    else
                    {
                        _log.LogWarning($"No signature pages were found in document {fileName}. DocumentId: {document.id}.");
                    }

                }
                catch (Exception e)
                {

                }
            }
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
