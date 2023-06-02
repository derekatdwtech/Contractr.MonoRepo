using System;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Contractr.Notification.Api.Repository;
using Contractr.Status.Update.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Contractr.Notification.Api.Service
{
    public class NotificationReceiverService : IHostedService
    {

        private IHubContext<NotificationHub> _hub { get; }
        private readonly ILogger<NotificationReceiverService> _log;
        private IServiceBus _serviceBus;

        public NotificationReceiverService(IHubContext<NotificationHub> hub, IServiceBus serviceBus, ILogger<NotificationReceiverService> log)
        {
            _hub = hub;
            _log=log;
            _serviceBus = serviceBus;

        }
       public async Task StartAsync(CancellationToken stoppingToken)
        {
            _log.LogInformation("Starting Service Bus Processor");
            await _serviceBus.PrepareFiltersAndHandleMessages("test", ProcessMessage);

        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        private async Task ProcessMessage(ProcessMessageEventArgs args)
        {
            _log.LogInformation($"Received message: {args.Message.Body.ToString()}");
            try
            {
                string group = args.Message.ReplyTo;
                if (!string.IsNullOrEmpty(group))
                {
                    _log.LogInformation($"Dispathcing message for group {group}");
                    await _hub.Clients.Group(group).SendAsync("ReceiveMessage", args.Message.Body.ToString());
                }

                await args.CompleteMessageAsync(args.Message).ConfigureAwait(false);

            }
            catch (Exception e)
            {
                _log.LogError($"Unable to process message {args.Message.MessageId}", e);
                await args.AbandonMessageAsync(args.Message).ConfigureAwait(false);
            }

        }
    }
}