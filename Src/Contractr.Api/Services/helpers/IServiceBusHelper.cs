using System.Threading.Tasks;

namespace Contractr.Api.Services
{
    public interface IServiceBusHelper
    {
        Task SendStatusUpdateMessage(string message);
        Task SendDocumentConversionMessage(string message);
        Task SendDocumentParseMessage(string message);


    }
}