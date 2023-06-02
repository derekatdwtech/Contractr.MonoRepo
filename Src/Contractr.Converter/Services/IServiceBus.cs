using Azure.Messaging.ServiceBus;

namespace Contractr.Converter.Services {
    public interface IServiceBus {
        void SendStatusUpdateMessage(string message);
        void SendDocumentParseMessage(string message);
        Task ReceiveDocumentMessage(Func<ProcessMessageEventArgs, Task> ProcessMessage);

    }
}