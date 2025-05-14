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
            // load pdf and identify signature page
            List<int> listSignaturePages = new();
            // List Of Files to return
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

                    bool isSignaturePage = false;
                    List<string> detectedNames = new();

                    // Detect signature page
                    foreach (var signatureKey in searchKeys)
                    {
                        if (signatureKey.isSignature)
                        {
                            if (page.Text.Contains(signatureKey.key, StringComparison.OrdinalIgnoreCase))
                            {
                                isSignaturePage = true;
                                break;
                            }
                        }
                    }

                    if (isSignaturePage)
                    {
                        // Run name detection only if signature page
                        foreach (var signatureKey in searchKeys)
                        {
                            if (page.Text.Contains(signatureKey.key, StringComparison.OrdinalIgnoreCase) && signatureKey.isNameField)
                            {

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

                        if (detectedNames.Count > 0)
                        {
                            foreach (var name in detectedNames)
                            {
                                string nameFile = Path.Combine(outputDirectory, $"{Path.GetFileNameWithoutExtension(outputFileName)}_page_{page.Number}_{name}{pdfExt}");
                                _log.LogInformation($"Signature marker found on page: {page.Number}. Processing...");
                                listSignaturePages.Add(page.Number);
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
                            // No names found, just save the signature page as before
                            string sigPageFile = Path.Combine(outputDirectory, $"{Path.GetFileNameWithoutExtension(outputFileName)}_page_{page.Number}{pdfExt}");
                            _log.LogInformation($"Signature marker found on page: {page.Number}. Processing...");
                            listSignaturePages.Add(page.Number);
                            PdfDocumentBuilder pdfBuilder = new PdfDocumentBuilder();
                            PdfPageBuilder pdfPage = pdfBuilder.AddPage(pageSize);
                            pdfPage.CopyFrom(page);
                            byte[] pdfBytes = pdfBuilder.Build();

                            File.WriteAllBytes(sigPageFile, pdfBytes);
                            _log.LogInformation($"File Saved: {sigPageFile}");
                            signaturePages.Add(new FileInfo(sigPageFile));
                            _log.LogInformation($"Generated signature page (no name detected) for page {page.Number}.");
                        }
                    }

                    // process signature fields...
                    int signatureFieldIdx = 1;
                    foreach (var coordSet in coordSets)
                    {
                        PdfSharpCore.Drawing.XPoint xp1 = new();
                        PdfSharpCore.Drawing.XPoint xp2 = new();

                        xp1 = new PdfSharpCore.Drawing.XPoint(coordSet.BottomLeft.X + 40, coordSet.BottomLeft.Y);
                        xp2 = new PdfSharpCore.Drawing.XPoint(coordSet.TopRight.X + 100, coordSet.TopRight.Y + 5);

                        string sigFileName = Path.GetFileNameWithoutExtension(modifiedFileName) + $"_sig{signatureFieldIdx}" + Path.GetExtension(modifiedFileName);

                        PdfSharpCore.Pdf.PdfDocument sigBlockDoc = PdfReader.Open(outputDirectory + "/" + modifiedFileName);
                        var sigFile = new Contractr.Parser.Models.PdfSignatureField(sigBlockDoc,
                            new PdfSharpCore.Pdf.PdfRectangle(xp1, xp2)
                            );

                        sigBlockDoc.Pages[0].Annotations.Add(sigFile);

                        _log.LogInformation($"Saving signature file {outputDirectory}/{sigFileName}");
                        sigBlockDoc.Save($"{outputDirectory}/{sigFileName}");
                        signaturePages.Add(new FileInfo($"{outputDirectory}/{sigFileName}"));
                        signatureFieldIdx++;
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