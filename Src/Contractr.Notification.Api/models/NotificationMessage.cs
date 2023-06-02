using System;

namespace Contractr.Notification.Api.Models {
    public class NotificationMessage {
        public string body {get; set;}
        public DateTime receiveOn {get; set;}
        public string subject {get; set;}
    }
}