using Contractr.Entities;

namespace Contractr.Api.Services {
    public interface IAuth0Service {
        void AddOrganization(Auth0Organization organization);
    }
}