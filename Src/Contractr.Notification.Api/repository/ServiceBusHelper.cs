using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Azure.Messaging.ServiceBus.Administration;
using Contractr.Notification.Api.Config;
using Contractr.Notification.Api.Models;
using Contractr.Notification.Api.Repository;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Contractr.Status.Update.Services
{
    public interface IServiceBusTopicSubscription
    {
        Task PrepareFiltersAndHandleMessages();
        Task CloseQueueAsync();
        ValueTask DisposeAsync();

    }
    public class ServiceBusHelper : IServiceBus
    {
        private IOptions<NotificationQueueConfiguration> Options { get; }
        private readonly ServiceBusClient _client;
        private ServiceBusProcessor _processor;
        private ILogger<ServiceBusHelper> _log;
        private const string TOPIC_NAME = "notifications.update.t";

        public ServiceBusHelper(IOptions<NotificationQueueConfiguration> options, ILogger<ServiceBusHelper> log)
        {
            Options = options;
            _log = log;
            _client = new ServiceBusClient(Options.Value.ConnectionString);

        }

        public async Task PrepareFiltersAndHandleMessages(string subscription, Func<ProcessMessageEventArgs, Task> processMessage)
        {
            Console.WriteLine("Entering service bus processor");
            ServiceBusProcessorOptions _options = new ServiceBusProcessorOptions
            {
                MaxConcurrentCalls = 1,
                AutoCompleteMessages = false
            };

            _processor = _client.CreateProcessor(TOPIC_NAME, subscription, _options);
            _processor.ProcessMessageAsync += processMessage;
            _processor.ProcessErrorAsync += ProcessErrorAsync;

            await _processor.StartProcessingAsync();

        }

        private async Task<string> ProcessMessagesAsync(ProcessMessageEventArgs args)
        {
            var message = JsonConvert.SerializeObject(args.Message.Body.ToObjectFromJson<NotificationMessage>());
            _log.LogTrace($"Processing Message Body: {message}");
            await args.CompleteMessageAsync(args.Message).ConfigureAwait(false);
            return message;
        }

        private Task ProcessErrorAsync(ProcessErrorEventArgs arg)
        {
            _log.LogError(arg.Exception, "Message handler encountered an exception");
            _log.LogDebug($"- ErrorSource: {arg.ErrorSource}");
            _log.LogDebug($"- Entity Path: {arg.EntityPath}");
            _log.LogDebug($"- FullyQualifiedNamespace: {arg.FullyQualifiedNamespace}");

            return Task.CompletedTask;
        }

        public async ValueTask DisposeAsync()
        {
            if (_processor != null)
            {
                await _processor.DisposeAsync().ConfigureAwait(false);
            }

            if (_client != null)
            {
                await _client.DisposeAsync().ConfigureAwait(false);
            }
        }
    }
}