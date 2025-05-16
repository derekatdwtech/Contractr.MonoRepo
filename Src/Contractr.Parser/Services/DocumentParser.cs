using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using Contractr.Entities;
using Contractr.Parser.Models;
using Dapper;
using Microsoft.Extensions.Logging;
using PdfSharpCore.Pdf.IO;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using UglyToad.PdfPig.Core;
using UglyToad.PdfPig.Writer;
using System.Linq;

namespace Contractr.Parser.Services
{
    public class DocumentParser : IDocumentParser
    {
        private IBlobStorage _blob;
        private IDatabaseProvider _db;
        private ILogger<DocumentParser> _log;
        public DocumentParser(IDatabaseProvider db, IBlobStorage blob, ILogger<DocumentParser> log)
        {
            _db = db;
            _blob = blob;
            _log = log;
        }

        public List<FileInfo> ParseDocument(FileInfo document, string outputDirectory)
        {

            if (!String.IsNullOrEmpty(document.Name) && File.Exists(document.FullName))
            {
                _log.LogInformation($"Parsing document {document.Name} for signature pages.");
                var signaturePages = FindAndCreateSignaturePages(document.FullName, outputDirectory);
                return signaturePages;
            }
            else
            {
                _log.LogError($"Cannot find document {document.Name}.");
                return null;
            }
        }

        private List<FileInfo> FindAndCreateSignaturePages(string filePath, string outputDirectory)
        {
            List<SearchKey> searchKeys = new SignatureKeys().SearchKeys;
            List<FileInfo> signaturePages = new();
            string outputFileName = Path.GetFileName(filePath);
            _log.LogInformation($"Opening pdf file for parsing: {filePath}");

            using (PdfDocument document = PdfDocument.Open(filePath))
            {
                _log.LogDebug("Document is open");
                int pageIdx = 1;
                foreach (UglyToad.PdfPig.Content.Page page in document.GetPages())
                {
                    _log.LogDebug($"Processing Page {page.Number} of {document.NumberOfPages} in file {outputFileName}");
                    string pageText = page.Text;
                    var pageSize = page.Size;
                    List<PdfRectangle> coordSets = new();
                    string pdfExt = Path.GetExtension(outputFileName);
                    string modifiedFileName = Path.GetFileNameWithoutExtension(outputFileName) + "_page_" + pageIdx + pdfExt;

                    bool hasSignatureKey = false;
                    bool hasNameField = false;
                    List<string> detectedNames = new();

                    // First check for signature keys
                    foreach (var signatureKey in searchKeys)
                    {
                        if (signatureKey.isSignature && page.Text.Contains(signatureKey.key, StringComparison.OrdinalIgnoreCase))
                        {
                            hasSignatureKey = true;
                            break;
                        }
                    }

                    // Only proceed with name detection if we found a signature key
                    if (hasSignatureKey)
                    {
                        // Check for name fields
                        foreach (var signatureKey in searchKeys)
                        {
                            if (signatureKey.isNameField && page.Text.Contains(signatureKey.key, StringComparison.OrdinalIgnoreCase))
                            {
                                hasNameField = true;
                                _log.LogDebug($"Checking for names using key: {signatureKey.key}");
                                _log.LogDebug($"Page text: {page.Text}");
                                var regexStr = $"(?<={signatureKey.key}\\s*)\\b([A-Z]{{1}}[a-z]+)\\s+([A-Z]{{1}}[a-z]+)\\b";
                                Regex re = new Regex(regexStr, RegexOptions.IgnoreCase);
                                MatchCollection names = re.Matches(page.Text);
                                foreach (Match name in names)
                                {
                                    _log.LogDebug($"Found name: {name.Value}");
                                    detectedNames.Add(name.Value.Replace(" ", "_"));
                                }
                            }
                        }

                        // Only process as signature page if we have both a signature key and at least one name
                        if (hasNameField && detectedNames.Count > 0)
                        {
                            foreach (var name in detectedNames)
                            {
                                string nameFile = Path.Combine(outputDirectory, $"{Path.GetFileNameWithoutExtension(outputFileName)}_page_{page.Number}_{name}{pdfExt}");
                                _log.LogInformation($"Signature marker and name found on page: {page.Number}. Processing...");
                                PdfDocumentBuilder pdfBuilder = new PdfDocumentBuilder();
                                PdfPageBuilder pdfPage = pdfBuilder.AddPage(pageSize);
                                pdfPage.CopyFrom(page);
                                byte[] pdfBytes = pdfBuilder.Build();

                                File.WriteAllBytes(nameFile, pdfBytes);
                                _log.LogInformation($"File Saved: {nameFile}");
                                signaturePages.Add(new FileInfo(nameFile));
                                _log.LogInformation($"Generated signature page for {name} on page {page.Number}.");
                            }
                        }
                        else
                        {
                            _log.LogDebug($"Page {page.Number} has signature key but no valid name field found. Skipping.");
                        }
                    }

                    pageIdx++;
                }
                document.Dispose();
            }
            return signaturePages;
        }

        public int InsertSignaturePagesSql(SignaturePage document)
        {
            try
            {
                SqlHelper _helper = new();
                string sql = "INSERT INTO signature_documents (id, parent_document, deal_id, file_name, blob_uri) VALUES (@id, @parent_document, @deal_id, @file_name, @blob_uri)";
                DynamicParameters _params = _helper.GetDynamicParameters(document);
                return _db.Insert(sql, _params);
            }
            catch (Exception e)
            {
                _log.LogError(e.Message, e);
                return -1;
            }
        }
    }
}