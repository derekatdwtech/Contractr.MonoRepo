using System.Data;
using System.Data.Common;
using Dapper;

namespace Contractr.Converter.Services
{
    public interface IDatabaseProvider : IDisposable
    {
        DbConnection GetDbConnection();

        /* string sql accepts text or stored procedure. Set Command Type accordingly */
        T Select<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        List<T> SelectMany<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        int Insert(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);

        T Update<T>(string sql, DynamicParameters dParams, CommandType commandType = CommandType.Text);
    }
}