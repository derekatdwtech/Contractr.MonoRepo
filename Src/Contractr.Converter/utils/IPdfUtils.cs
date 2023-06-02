namespace Contractr.Converter.Utils {
    public interface IPdfUtils {
        Task<FileInfo> ConvertWordDocumentToPDF(FileInfo wordFile, string outputDirectory);
    }
}