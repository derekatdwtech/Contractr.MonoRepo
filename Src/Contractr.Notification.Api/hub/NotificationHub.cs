using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Contractr.Notification.Api.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Contractr.Notification.Api
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private IOrganization _org;
        public NotificationHub(IOrganization org)
        {
            _org = org;
        }

        public override Task OnConnectedAsync()
        {

            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!String.IsNullOrEmpty(userId))
            {
                string orgId = _org.GetOrganizationByUserId(userId);
                if (!string.IsNullOrEmpty(orgId))
                {
                    Console.WriteLine($"Adding to signalr group {orgId}");
                    Groups.AddToGroupAsync(Context.ConnectionId, orgId);
                }
                else
                {
                    Console.WriteLine($"User is not a memeber of an organization. Skipping notifications");
                }
            }
            else
            {
                Console.WriteLine("No userId retrieved form http context.");
            }
            return base.OnConnectedAsync();
        }

        public async Task SendGroupMessage(string group, string message)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", message);
        }

        // public async Task SendMessage()
        // {
        //     Console.WriteLine("Preparing to receive message");
        //     _groupName = "test";
        //     try
        //     {
        //         _log.LogInformation($"Adding user to group {_groupName}. ContextId {Context.ConnectionId}");
        //         await Groups.AddToGroupAsync(Context.ConnectionId, _groupName);
        //         try
        //         {
        //             _log.LogInformation($"Starting to listen for messages");
        //             await _serviceBus.PrepareFiltersAndHandleMessages(_groupName, ProcessMessage);

        //         }
        //         catch(Exception e) {
        //             _log.LogError("Unable to receive messages.", e);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         _log.LogError($"Failed to add user to group {_groupName}", ex);
        //     }
        // }
    }
}