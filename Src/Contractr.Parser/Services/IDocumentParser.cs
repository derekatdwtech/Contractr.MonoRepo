using System.Collections.Generic;
using System.IO;
using Contractr.Entities;

namespace Contractr.Parser.Services
{
    public interface IDocumentParser {
        List<FileInfo> ParseDocument(FileInfo document, string outputDirectory);
        int InsertSignaturePagesSql(SignaturePage document);
    }
}