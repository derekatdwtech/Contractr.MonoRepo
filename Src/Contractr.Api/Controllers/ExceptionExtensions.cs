using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Contractr.Api.Controllers
{
    public static class ExceptionExtensions
    {
        public static ProblemDetails ToProblemDetails(this Exception e)
        {
            return new ProblemDetails()
            {
                Status = (int)GetErrorCode(e.InnerException ?? e),
                Title = e.Message
            };
        }

        private static HttpStatusCode GetErrorCode(Exception e)
        {
            switch (e)
            {
                case ValidationException _:
                    return HttpStatusCode.BadRequest;
                case FormatException _:
                    return HttpStatusCode.BadRequest;
                case AuthenticationException _:
                    return HttpStatusCode.Forbidden;
                case NotImplementedException _:
                    return HttpStatusCode.NotImplemented;
                default:
                    return HttpStatusCode.InternalServerError;
            }
        }

    }
}
