using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Dapper;

namespace Contractr.Parser.Services
{
    public interface IDatabaseProvider
    {
        DbConnection GetDbConnection();

        /* string sql accepts text or stored procedure. Set Command Type accordingly */
        T Select<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        List<T> SelectMany<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        int Insert(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        // T Update<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);
    }
}