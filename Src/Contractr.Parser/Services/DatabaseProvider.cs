using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using System.Linq;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace Contractr.Parser.Services
{
    public class DatabaseProvider : IDatabaseProvider
    {
        private string _connStr;
        private readonly IConfiguration _config;

       public DatabaseProvider(IConfiguration config)
        {
            _config = config;
            _connStr = _config.GetConnectionString("ContractrDatabase");
        }


        public DbConnection GetDbConnection()
        {
            return new SqlConnection(_connStr);
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

        // public T Update<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text)
        // {
        //     // Do nothing
            
        // }

    }
}