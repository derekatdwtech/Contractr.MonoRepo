using System.Collections.Generic;
using Contractr.Entities;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Services
{
    public class DealRepository : IDeal
    {
        private IDatabaseProvider _db {get;}
        private SqlHelper _helper;
        private readonly ILogger<DealRepository> _log;
        public DealRepository(ILogger<DealRepository> logger, IDatabaseProvider db)
        {
            _log = logger;
            _db = db;
            _helper = new SqlHelper(_log);
        }

        public Deal AddDeal(Deal deal)
        {

            string sql = "INSERT INTO deals (id, unique_name, description, start_date, close_date, buyor, seller, organization, deal_status_id) VALUES (@id, @unique_name, @description, @start_date, @close_date, @buyor, @seller, @organization, @deal_status_id);";
            deal.deal_status_id = 1;
            DynamicParameters _params = _helper.GetDynamicParameters(deal);
            int result = _db.Insert(sql, _params);
            _log.LogInformation(result.ToString());
            if (result > 0)
            {
                _log.LogInformation($"Successfully added Deal {deal.unique_name}");
                string resultSql = "SELECT * FROM deals WHERE unique_name = @unique_name AND organization = @organization;";
                return _db.Select<Deal>(resultSql, _params);
            }
            else
            {
                _log.LogError($"Failed to add Deal {deal.unique_name}.");
                return null;
            }
        }

        public Deal GetDealById(string id)
        {
            string sql = "SELECT d.*, ds.name as status FROM deals as d join deal_status as ds on d.deal_status_id = ds.id WHERE d.id = @id;";
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@id", id);

            return _db.Select<Deal>(sql, _params);
        }

        public List<Deal> GetDealsForOrganization(string organization)
        {
            string sql = "SELECT d.*, ds.name as status FROM deals as d join deal_status as ds on d.deal_status_id = ds.id WHERE d.organization = @organization ORDER BY d.start_date asc;";
            DynamicParameters _params = new DynamicParameters();
            _params.Add("@organization", organization);

            return _db.SelectMany<Deal>(sql, _params);
        }
    }
}