using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using Contractr.Entities;
using Contractr.Entities.Config;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Contractr.Api.Services
{
    public class DocumentService : IDocument
    {
        private IBlobService _blob;
        private ILogger<DocumentService> _log { get; }
        private IDatabaseProvider _db { get; }
        private IServiceBusHelper _sb { get; }
        private IOptions<BlobStorageConfiguration> Options { get; }
        private SqlHelper _helper;
        public DocumentService(ILogger<DocumentService> log, IOptions<BlobStorageConfiguration> options, IDatabaseProvider db, IServiceBusHelper sb, IBlobService blob)
        {
            _log = log;
            _db = db;
            _blob = blob;
            _sb = sb;
            Options = options;

            _helper = new SqlHelper(_log);
        }
        public void DownloadDocument(string id)
        {
            throw new NotImplementedException();
        }

        public List<OriginalDocument> GetDocuments(string deal_id)
        {
            string sql = @"SELECT od.*, covd.*, sd.*, sig.*
                            FROM original_documents as od LEFT JOIN converted_documents as covd on od.id = covd.parent_document
                                LEFT JOIN signature_documents as sd on covd.id = sd.parent_document
                                LEFT JOIN signed_documents as sig on sd.id = sig.parent_document
                            WHERE od.deal_id = @deal_id order by od.uploaded_on;";
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@deal_id", deal_id);

            using (var db = _db.GetDbConnection())
            {
                return db.Query<OriginalDocument, ConvertedDocument, SignaturePage, SignedDocument, OriginalDocument>(sql, map: (od, covd, sd, sig) =>
                {
                    od.convertedDocument = covd;
                    if (sd != null)
                    {
                        od.signaturePages.Add(sd);
                    }

                    if (sig != null)
                    {
                        od.signedDocuments.Add(sig);
                    }
                    return od;

                }, _params).GroupBy(od => od.id).Select(group => new OriginalDocument
                {
                    id = group.Key,
                    file_name = group.Select(fn => fn.file_name).FirstOrDefault(),
                    blob_uri = group.Select(bu => bu.blob_uri).FirstOrDefault(),
                    uploaded_by = group.Select(obj => obj.uploaded_by).FirstOrDefault(),
                    uploaded_on = group.Select(up => up.uploaded_on).FirstOrDefault(),
                    deal_id = group.Select(obj => obj.deal_id).FirstOrDefault(),
                    signaturePages = group.SelectMany(sd => sd.signaturePages).Distinct().ToList(),
                    convertedDocument = group.Select(obj => obj.convertedDocument).FirstOrDefault(),
                    signedDocuments = group.SelectMany(sp => sp.signedDocuments).Distinct().ToList(),
                }).ToList();

            }
        }

        // The container name parameter is the organization ID. This is how we will organize files.
        public async Task<OriginalDocument> UploadDocument(IFormFile file, string uploadedBy, string dealId)
        {
            OriginalDocument document = new()
            {
                file_name = file.FileName,
                blob_uri = null,
                uploaded_by = uploadedBy,
                deal_id = dealId
            };
            try
            {

                string container = GetOrganizationIdFromDealId(dealId).ToLower();
                BlobOperationResponse result = await _blob.UploadFileFromStream(container, file, $"{dealId.ToString()}/{document.id}");
                if (!result.Error)
                {
                    document.blob_uri = result.Blob.Uri;
                    document.uploaded_on = result.Blob.CreatedOn;
                    StatusMessage status = new StatusMessage()
                    {
                        document_id = document.id,
                        current_status = 1
                    };

                    try
                    {
                        int sqlResp = InsertOrignialDocumentSQL(document);
                        if (sqlResp > 0)
                        {
                            if (Path.GetExtension(file.FileName).Contains(".pdf"))
                            {
                                int resp = InsertConvertedDocumentSQL(document);
                                document.parent_document = document.id;
                                await _sb.SendDocumentParseMessage(JsonConvert.SerializeObject(document));
                            }
                            else
                            {
                                await _sb.SendDocumentConversionMessage(JsonConvert.SerializeObject(document));

                            }
                            // Send Status message of upload
                            return document;
                        }
                        else
                        {
                            return null;
                        }
                    }
                    catch (Exception exp)
                    {
                        _log.LogError(exp, exp.Message);
                        return null;
                    }
                    finally
                    {
                        await _sb.SendStatusUpdateMessage(JsonConvert.SerializeObject(status));
                    }
                }
                else
                {
                    throw new Exception(result.Status);
                }
            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
                return null;
            }


        }

        private string GetOrganizationIdFromDealId(string dealId)
        {
            try
            {
                string sql = "SELECT organization from deals WHERE id = @deal_id";
                DynamicParameters _params = new DynamicParameters();
                _params.Add("@deal_id", dealId);
                var org = _db.Select<string>(sql, _params);
                return org;
            }
            catch (SqlException ex)
            {
                _log.LogError(ex, "Failed to ascertain the organization the deal belongs to.");
                return "";
            }
        }

        public async Task<FileInfo> DownloadSignaturePages(string document_id)
        {
            List<SignaturePage> pages = GetSignaturePagesForDocument(document_id);
            if (pages.Count > 0)
            {
                if (!Directory.Exists(document_id))
                {
                    Directory.CreateDirectory(document_id);
                }

                try
                {
                    string orgId = GetOrganizationIdFromDealId(pages[0].deal_id);
                    if (File.Exists($"{orgId.ToLower()}_{document_id}.zip"))
                    {
                        _log.LogInformation("Cleaning up previous zip files");
                        File.Delete($"{orgId.ToLower()}_{document_id}.zip");
                    }
                    if (!String.IsNullOrEmpty(orgId))
                    {
                        foreach (SignaturePage s in pages)
                        {
                            string[] parts = GetUriSegments(s.blob_uri);
                            string remoteFilePath = string.Join("/", parts.Skip(1).ToArray());
                            _log.LogInformation($"Downloading from remote file path {remoteFilePath}");
                            await _blob.DownloadBlob(orgId.ToLower(), remoteFilePath, $"{document_id}/{parts.Last()}");
                        }
                    }
                    try
                    {
                        _log.LogInformation("Compressing archive");

                        ZipFile.CreateFromDirectory(document_id, $"{orgId.ToLower()}{document_id.ToLower()}.zip");
                        new DirectoryInfo(document_id).Delete(true);
                        return new FileInfo($"{orgId.ToLower()}{document_id.ToLower()}.zip");
                    }
                    catch (Exception ex)
                    {
                        _log.LogError(ex.Message);
                        throw ex;
                    }
                }
                catch (Exception e)
                {
                    _log.LogError(e.Message);
                    throw e;
                }
            }
            else
            {
                _log.LogWarning("No signature pages found for this document.");
                throw new Exception("No signature pages found for this document.");
            }
        }

        public List<SignaturePage> GetSignaturePagesForDocument(string document_id)
        {
            string sql = "SELECT * FROM signature_documents where parent_document = (select cd.id from converted_documents as cd where cd.parent_document = @id);";
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@id", document_id);
            List<SignaturePage> pages = _db.SelectMany<SignaturePage>(sql, _params).ToList<SignaturePage>();
            return pages;
        }
        private string[] GetUriSegments(string input)
        {
            return new Uri(Uri.UnescapeDataString(input)).AbsolutePath.TrimStart('/').Split('/');
        }

        private int InsertOrignialDocumentSQL(OriginalDocument document)
        {
            string sql = "INSERT INTO original_documents (id, file_name, blob_uri, uploaded_by, deal_id) VALUES (@id, @file_name, @blob_uri, @uploaded_by, @deal_id);";
            DynamicParameters _params = _helper.GetDynamicParameters(document);
            return _db.Insert(sql, _params);
        }

        // This method is confusing. It's used in case the ser uploads a PDF. BEcause of the similarities between documkent object models,
        // I have opted to use the orginal document object for this purpose to decrease code rewrite
        private int InsertConvertedDocumentSQL(OriginalDocument document)
        {
            string sql = "INSERT INTO converted_documents (id, file_name, blob_uri, parent_document, uploaded_by, deal_id) VALUES (@id, @file_name, @blob_uri, @parent_document, @uploaded_by, @deal_id);";
            DynamicParameters _params = _helper.GetDynamicParameters(document);
            return _db.Insert(sql, _params);
        }
    }
}