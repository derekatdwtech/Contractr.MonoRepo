using System;
using Contractr.Entities;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Services
{
    public class OrganizationRepository : IOrganization
    {
        private IDatabaseProvider _db { get; }
        private SqlHelper _helper;
        private ILogger<OrganizationRepository> _log { get; }

        public OrganizationRepository(ILogger<OrganizationRepository> logger, IDatabaseProvider db)
        {
            _log = logger;
            _db = db;
            _helper = new SqlHelper(_log);

        }
        public Organization AddOrganization(Organization organization)
        {
            _log.LogInformation("Beginning to insert organization");
            string sql = @"INSERT INTO organization (id, name, address, city, state, country, zip, phone, owner) VALUES (@id, @name, @address, @city, @state, @country, @zip, @phone, @owner); 
                           INSERT INTO assigned_roles (user_id, member_of, role_id) VALUES (@owner, @id, (SELECT id from roles WHERE role_name='Admin'));";

            DynamicParameters _params = _helper.GetDynamicParameters(organization);
            int result = _db.Insert(sql, _params);

            if (result > 0)
            {
                _log.LogInformation($"Successfully created organization {organization.name}");
                string resultSql = "SELECT * FROM organization WHERE name = @name AND owner = @owner;";
                return _db.Select<Organization>(resultSql, _params);
            }
            else
            {
                _log.LogError($"Failed to insert {organization.name}.");
                return null;
            }

        }

        public Organization GetOrganization(string organizationName)
        {
            throw new NotImplementedException();
        }

        public Organization GetOrganizationByOwner(string owner)
        {
            string sql = "SELECT * FROM organization where owner = @owner";

            DynamicParameters _params = new DynamicParameters();
            _params.Add("@owner", owner);

            return _db.Select<Organization>(sql, _params);
        }
    }
}