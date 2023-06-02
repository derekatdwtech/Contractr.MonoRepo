using System;
using System.Collections.Generic;
using Contractr.Entities;
using Contractr.Entities.Config;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;

namespace Contractr.Api.Services
{

    public class Auth0Service : IAuth0Service
    {
        private IOptions<Auth0Configuration> Options {get;}
        private static string _accessToken;
        readonly RestClient _client;

        private Dictionary<string, string> headers = new();

        public Auth0Service(IOptions<Auth0Configuration> options)
        {
            Options = options;
            _client = new RestClient($"https://{Options.Value.Domain}/");
            
            _accessToken = GetAccessToken();

            headers.Add("Authorization", $"Bearer {_accessToken}");

        }
        public void AddOrganization(Auth0Organization organization)
        {
            RestRequest _request = new();
            _request.Resource = "api/v2/organizations";
            _request.Method = Method.Post;
            _request.AddHeaders(headers);
            _request.AddJsonBody(organization);
            try {
                _client.Execute(_request);
            }
            catch(Exception e) {
                Console.WriteLine(e);
            }
            


        }
        private string GetAccessToken()
        {

            RestRequest _request = new();
            _request.Resource = "oauth/token";
            _request.Method = Method.Post;

            _request.AddHeader("content-type", "application/x-www-form-urlencoded");
            RestResponse _response = _client.Execute<Auth0AuthenticationResponse>(_request);
            return JsonConvert.DeserializeObject<Auth0AuthenticationResponse>(_response.Content).access_token;

        }
    }

}