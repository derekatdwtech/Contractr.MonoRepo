using System.Collections.Generic;

namespace Contractr.Parser.Models
{
    public class SignatureKeys
    {
        public SignatureKeys()
        {
            SearchKeys = new List<string>() {
                "BUYER:",
                "By:",
                "Name:",
                "[Name]",
                "[Title]"
            };
        }

        public List<string> SearchKeys { get; set; }

    }
}