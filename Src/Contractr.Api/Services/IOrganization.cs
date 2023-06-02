namespace Contractr.Api.Services {
    public interface IOrganization {
        Organization AddOrganization(Organization organization);
        Organization GetOrganization(string organizationName);
        Organization GetOrganizationByOwner(string owner);
    }
}