using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;

namespace Contractr.Notification.Api.Repository {
    public interface IServiceBus {
        Task PrepareFiltersAndHandleMessages(string subscription, Func<ProcessMessageEventArgs, Task> processMessage);
        
    }
}