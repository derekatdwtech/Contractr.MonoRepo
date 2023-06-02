using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using Contractr.Entities.Config;
using Dapper;
using Microsoft.Extensions.Options;

namespace Contractr.Api.Services
{
    public class DatabaseProvider : IDatabaseProvider
    {
        private IOptions<DatabaseConfiguration> Options { get; }
        public DatabaseProvider(IOptions<DatabaseConfiguration> options)
        {
            Options = options;
        }

        public void Dispose()
        {

        }

        public DbConnection GetDbConnection()
        {
            return new SqlConnection(Options.Value.ConnectionString);
        }

        public int Insert(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text)
        {
            using (var _db = this.GetDbConnection())
            {
                return _db.Execute(sql, dParams, commandType: commandType);

            }
        }

        public T Select<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text)
        {
            using (var _db = this.GetDbConnection())
            {
                return _db.Query<T>(sql, dParams, commandType: commandType).SingleOrDefault<T>();
            }
        }

        public List<T> SelectMany<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text)
        {
            using (var _db = this.GetDbConnection())
            {
                return _db.Query<T>(sql, dParams, commandType: commandType).ToList();
            }
        }

        public T Update<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text)
        {
            throw new NotImplementedException();
        }
    }
}