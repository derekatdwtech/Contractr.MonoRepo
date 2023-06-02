using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;

namespace Contractr.Parser.Services {
    public interface IServiceBus {
        void SendStatusUpdateMessage(string message);

    }
}