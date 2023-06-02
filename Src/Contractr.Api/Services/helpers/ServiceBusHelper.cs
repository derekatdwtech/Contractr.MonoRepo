using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Contractr.Entities.Config;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Contractr.Api.Services
{
    public class ServiceBusHelper : IServiceBusHelper
    {
        private IOptions<ServiceBusConfiguration> Options {get;}
        private ILogger<ServiceBusHelper> Log;
        private ServiceBusClient _client;
        private ServiceBusSender _sender;
        private const string DOCUMENT_CONVERSION_QUEUE_NAME = "document.conversion.q";
        private const string DOCUMENT_PARSE_QUEUE_NAME = "document.parse.q";
        private const string STATUS_UPDATE_QUEUE_NAME = "status.update.q";


        // topicName can be queue or topic
        public ServiceBusHelper(IOptions<ServiceBusConfiguration> options, ILogger<ServiceBusHelper> log)
        {
            Options = options;
            Log = log;
        }

        public  async Task SendStatusUpdateMessage(string message)
        {
            await SendMessage(Options.Value.StatusQueueSend, STATUS_UPDATE_QUEUE_NAME, message);
        }
        public  async Task SendDocumentConversionMessage(string message)
        {
            await SendMessage(Options.Value.DocumentQueueSend, DOCUMENT_CONVERSION_QUEUE_NAME, message);
        }

        public  async Task SendDocumentParseMessage(string message)
        {
            await SendMessage(Options.Value.DocumentParseQueueSend, DOCUMENT_PARSE_QUEUE_NAME, message);
        }

        private async Task SendMessage(string connString, string topicName, string message)
        {
            try
            {
                _client = new ServiceBusClient(connString);
                try
                {
                    _sender = _client.CreateSender(topicName);

                    using (ServiceBusMessageBatch _batch = await _sender.CreateMessageBatchAsync())
                    {
                        ServiceBusMessage sbMessage = new(message);
                        if (!_batch.TryAddMessage(sbMessage))
                        {
                            throw new Exception($"Message is too large. {sbMessage.Body.ToString()}");
                        }
                        Log.LogInformation($"Sending message to topic {topicName}");
                        await _sender.SendMessagesAsync(_batch);

                    }
                }
                catch (Exception ex)
                {
                    Log.LogError(ex.StackTrace, $"Failed to send service bus message.");

                }
                finally
                {
                    await _sender.DisposeAsync();
                }
            }
            catch (Exception ce)
            {
                Log.LogError(ce.StackTrace);

            }
            finally
            {
                await _client.DisposeAsync();
            }

        }
    }
}