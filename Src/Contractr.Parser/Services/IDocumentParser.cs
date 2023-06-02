using System.Collections.Generic;
using System.IO;
using Contractr.Parser.Models;

namespace Contractr.Parser.Services
{
    public interface IDocumentParser {
        List<FileInfo> ParseDocument(FileInfo document, string outputDirectory);
        int InsertSignaturePagesSql(GenericDocument document);
    }
}