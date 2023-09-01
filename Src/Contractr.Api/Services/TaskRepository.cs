using System.Collections.Generic;
using Contractr.Entities;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Services
{
    public class TaskRepository : ITask
    {
        private IDatabaseProvider _db { get; }
        private ILogger<TaskRepository> _log { get; }
        private SqlHelper _helper;
        public TaskRepository(IDatabaseProvider db, ILogger<TaskRepository> log)
        {
            _db = db;
            _log = log;
            _helper = new SqlHelper(_log);
        }


        public DealTask AddTask(DealTask task)
        {
            string sql = @"INSERT INTO tasks (deal_id, created_by, title, description, assigned_to, due_date, is_restricted, status) VALUES (@deal_id, @created_by, @title, @description, @assigned_to, @due_date, @is_restricted, @status);";
            DynamicParameters dp = _helper.GetDynamicParameters(task);

            _db.Insert(sql, dp);
            return task;
        }

        public TaskComment AddTaskComment(TaskComment comment)
        {
            throw new System.NotImplementedException();
        }

        public List<TaskComment> GetCommentsOnTask(string taskId)
        {
            throw new System.NotImplementedException();
        }

        public DealTask GetTask(string taskId)
        {
            throw new System.NotImplementedException();
        }

        public List<DealTask> GetTasksForDeal(string dealId)
        {
            string sql = "SELECT * FROM tasks WHERE deal_id = @deal_id";
            DynamicParameters dp = new();
            dp.Add("@deal_id", dealId);

            return _db.SelectMany<DealTask>(sql, dp);
        }
    }
}