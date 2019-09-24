﻿using GraphQL.Types;
using TodoApp.Data.Models;
using TodoApp.Data.Repositories;

namespace TodoApp.Api.GraphQL.GraphTypes.ObjectTypes
{
    public class TaskType : ObjectGraphType<Task>
    {
        public TaskType(IProjectRepository projectRepository, ITagRepository tagRepository)
        {
            Field("id", t => t.Id, type: typeof(NonNullGraphType<IdGraphType>)).Description("Id of the task");
            Field("title", t => t.Title).Description("Title of the task");
            Field("description", t => t.Description, nullable: true).Description("Description of the task");
            Field("priority", t => t.Priority, type: typeof(NonNullGraphType<TaskPriorityEnum>)).Description("Priority of the task");
            Field("isCompleted", t => t.CompletedOn.HasValue, nullable: false).Description("Indicates whether the task is completed");
            Field("completedOn", t => t.CompletedOn, type: typeof(DateTimeGraphType)).Description("Date and time the task wasc completed");
            Field("created", t => t.CreatedOn, type: typeof(NonNullGraphType<DateTimeGraphType>))
                .Description("Creation time of the task");
            FieldAsync<NonNullGraphType<ProjectType>>("project", 
                resolve: async context => await projectRepository.FindAsync(context.Source.ProjectId)
            );
            FieldAsync<NonNullGraphType<ListGraphType<NonNullGraphType<TagType>>>>("tags",
                resolve: async context => await tagRepository.GetTagsByTaskIdAsync(context.Source.Id)
            );
        }
    }
}