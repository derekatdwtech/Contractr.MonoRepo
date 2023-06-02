using Contractr.Entities;

namespace Contractr.Api.Services {
    public interface IUser {
        User AddUser(User user);

        User GetUserById(string id);

        
    }
}