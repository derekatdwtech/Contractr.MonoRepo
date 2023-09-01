using System.Collections.Generic;

namespace Contractr.Parser.Models
{
    public class SignatureKeys
    {
        public SignatureKeys()
        {
            SearchKeys = new List<SearchKey>() {
                new SearchKey () {
                    key = "BUYER:",
                    isSignature = false
                },
                new SearchKey () {
                    key = "By:",
                    isSignature = true,
                },
                new SearchKey () {
                    key = "By_",
                    isSignature = true,
                },
                new SearchKey() {
                    key = "Name:",
                    isSignature = false,
                    isNameField = true
                },
                new SearchKey() {
                    key ="[Name]",
                    isSignature = false
                },
                new SearchKey () {
                    key = "[Title]",
                    isSignature = false
                }
            };
        }

        public List<SearchKey> SearchKeys { get; set; }

    }

    public class SearchKey
    {
        public string key { get; set; }
        public bool isSignature { get; set; }
        public bool isNameField { get; set; } = false;
    }
}