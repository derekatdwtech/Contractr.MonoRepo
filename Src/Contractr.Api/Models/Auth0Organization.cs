using System.ComponentModel.DataAnnotations;

namespace Contractr.Entities {
    public class Auth0Organization {
        public string name {get; set;}
        public string display_name {get; set;} = "";
        // public Auth0Branding branding {get; set;} = null;
        // public Auth0OrganizationMetadata metadata {get; set;}= null;
        // public string[] enabled_connections {get; set;}= null;
    }

    public class Auth0Branding {
        public string logo_url {get; set;}
        public Auth0BrandingColors colors {get; set;}
    }

    public class Auth0OrganizationMetadata {

    }

    public class Auth0BrandingColors {
        public string primary {get; set;}
        public string page_background {get; set;}
    }
}