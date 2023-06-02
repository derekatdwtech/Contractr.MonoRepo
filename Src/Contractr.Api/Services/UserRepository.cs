using Contractr.Entities;
using Contractr.Entities.Config;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Contractr.Api.Services
{
    public class UserRepository : IUser
    {
        private IDatabaseProvider _db { get; }
        private SqlHelper _helper;
        private readonly ILogger<UserRepository> _log;
        public UserRepository(ILogger<UserRepository> log, IDatabaseProvider db)
        {
            _db = db;
            _log = log;
            _helper = new SqlHelper(_log);
        }

        public User AddUser(User user)
        {
            _log.LogInformation($"Adding user {user.email}");

            string sql = "INSERT INTO users (id, first_name, last_name, email, is_active) VALUES (@id, @first_name, @last_name, @email, @is_active);";
            DynamicParameters _params = _helper.GetDynamicParameters(user);
            int result = _db.Insert(sql, _params);
            _log.LogInformation(result.ToString());
            if (result > 0)
            {
                _log.LogInformation($"Successfully added user {user.id}");
                string resultSql = "SELECT * FROM users WHERE id = @id;";
                return _db.Select<User>(resultSql, _params);
            }
            else
            {
                _log.LogError($"Failed to add user {user.email}.");
                return null;
            }
        }
        public User GetUserById(string id)
        {

            string resultSql = "SELECT * FROM users WHERE id = @id;";
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@id", id);
            var result = _db.Select<User?>(resultSql, _params);
            return result;
        }
    }
}