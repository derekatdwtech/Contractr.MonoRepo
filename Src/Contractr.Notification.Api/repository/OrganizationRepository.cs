using System.Data.Common;
using Microsoft.Data.SqlClient;
using System.Linq;
using Contractr.Notification.Api.Config;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Contractr.Notification.Api.Repository {
    public class OrganizationRepository : IOrganization {
        
        private IOptions<DatabaseConfiguration> Options {get;}
        private readonly ILogger<OrganizationRepository> _log;

        public OrganizationRepository(IOptions<DatabaseConfiguration> options, ILogger<OrganizationRepository> log) {
            Options = options;
            _log = log;
        }

        public string GetOrganizationByUserId(string user) {
            string sql = "SELECT id from organization where owner = @owner";
            
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@owner", user);

            using(var db = GetDbConnection()) {
                return db.Query<string>(sql, _params).FirstOrDefault();
            }
        }

        public DbConnection GetDbConnection()
        {
            return new SqlConnection(Options.Value.ConnectionString);
        }
    }

}