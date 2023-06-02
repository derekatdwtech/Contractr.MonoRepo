using Contractr.Entities;
using Contractr.Converter.Services;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Office.Interop.Word;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using UglyToad.PdfPig.Writer;
using Document = Microsoft.Office.Interop.Word.Document;

namespace Contractr.Converter.Utils
{
    public class PdfUtils : IPdfUtils
    {
        private ILogger<PdfUtils> _log;
        public PdfUtils(ILogger<PdfUtils> log)
        {
            _log = log;
        }

        public async Task<FileInfo> ConvertWordDocumentToPDF(FileInfo wordFile, string outputDirectory)
        {
            CreateDirectoryIfNotExists(outputDirectory);

            _log.LogInformation($"Found file: {wordFile.FullName} for processing ...");
            Application word = new () {
                Visible = false,
                ScreenUpdating = false
            };

            object oMissing = System.Reflection.Missing.Value;

            Object filename = (Object)wordFile.FullName;

            Document doc = word.Documents.Open(ref filename, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing);
            doc.Activate();

            object outputFilePath = wordFile.FullName.Replace(Path.GetExtension(wordFile.Name), ".pdf");
            string outputFileName = wordFile.Name.Replace(Path.GetExtension(wordFile.Name), ".pdf");
            object fileFormat = WdSaveFormat.wdFormatPDF;

            doc.SaveAs(ref outputFilePath,
                        ref fileFormat, ref oMissing, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing,
                        ref oMissing, ref oMissing, ref oMissing, ref oMissing);

            object saveChanges = WdSaveOptions.wdDoNotSaveChanges;
            ((_Document)doc).Close(ref saveChanges, ref oMissing, ref oMissing);
            doc = null;

            _log.LogInformation($"Saved file: {outputFilePath}");

            ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
            word = null;

            return new FileInfo($"{outputFilePath}");
        }

        private void CreateDirectoryIfNotExists(string dir)
        {
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
        }
    }
}