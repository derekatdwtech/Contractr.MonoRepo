using System.Collections.Generic;
using Contractr.Entities;

namespace Contractr.Api.Services {
    public interface ITask {

        DealTask GetTask(string taskId);
        
        List<DealTask> GetTasksForDeal(string dealId);
        List<TaskComment> GetCommentsOnTask(string taskId);
        DealTask AddTask(DealTask task);
        TaskComment AddTaskComment(TaskComment comment);


    }
}