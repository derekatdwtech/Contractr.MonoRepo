using Azure.Messaging.ServiceBus;
using Contractr.Converter.Config;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Contractr.Converter.Services
{
    public class ServiceBus : IServiceBus
    {
        private IOptions<ServiceBusConfiguration> Options { get; }
        private ILogger<ServiceBus> _log;
        private const string STATUS_UPDATE_QUEUE = "status.update.q";
        private const string DOCUMENT_CONVERSION_QUEUE = "document.conversion.q";
                private const string DOCUMENT_PARSE_QUEUE = "document.parse.q";


        public ServiceBus(IOptions<ServiceBusConfiguration> options, ILogger<ServiceBus> log)
        {
            Options = options;
            _log = log;
        }

        public void SendStatusUpdateMessage(string message)
        {
            SendMessage(Options.Value.StatusQueueSend, STATUS_UPDATE_QUEUE, message);
        }

        public void SendDocumentParseMessage(string message)
        {
            SendMessage(Options.Value.DocumentParseQueueSend, DOCUMENT_PARSE_QUEUE, message);
        }

        public async Task ReceiveDocumentMessage(Func<ProcessMessageEventArgs, Task> ProcessMessage)
        {
            ServiceBusClient _client = new ServiceBusClient(Options.Value.DocumentQueueListen);

            var _proc = _client.CreateProcessor(DOCUMENT_CONVERSION_QUEUE, new ServiceBusProcessorOptions());
            _proc.ProcessMessageAsync += ProcessMessage;
            _proc.ProcessErrorAsync += ErrorHandler;

            await _proc.StartProcessingAsync();

        }

        private async void SendMessage(string connString, string topicName, string message)
        {
            ServiceBusClient _client = new ServiceBusClient(connString);
            try
            {
                ServiceBusSender _sender = _client.CreateSender(topicName);
                try
                {

                    using (ServiceBusMessageBatch _batch = await _sender.CreateMessageBatchAsync())
                    {
                        ServiceBusMessage sbMessage = new(message);
                        if (!_batch.TryAddMessage(sbMessage))
                        {
                            throw new Exception($"Message is too large. {sbMessage.Body.ToString()}");
                        }
                        _log.LogInformation($"Sending message to topic {topicName}");
                        await _sender.SendMessagesAsync(_batch);

                    }
                }
                catch (Exception ex)
                {
                    _log.LogError(ex.StackTrace, $"Failed to send service bus message.");

                }
                finally
                {
                    await _sender.DisposeAsync();
                }
            }
            catch (Exception ce)
            {
                _log.LogError(ce.StackTrace);

            }
            finally
            {
                await _client.DisposeAsync();
            }
        }

        // handle any errors when receiving messages
        private Task ErrorHandler(ProcessErrorEventArgs args)
        {
            _log.LogError(args.Exception.ToString());
            return Task.CompletedTask;
        }
    }
}
