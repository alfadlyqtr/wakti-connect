import React from "react";
import { TaskList } from "./TaskList";
import { Task, TaskStatus } from "@/types/task.types";
import { CalendarEvent } from "@/types/calendar.types";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TasksOverviewProps {
  tasks: Task[];
}

const TasksOverview: React.FC<TasksOverviewProps> = ({ tasks }) => {
  // Filter out archived tasks first
  const activeTasks = tasks.filter(task => !task.archived_at);
  
  // Group tasks by status (using active tasks only)
  const pendingTasks = activeTasks.filter(task => task.status === 'pending');
  const inProgressTasks = activeTasks.filter(task => task.status === 'in-progress');
  const completedTasks = activeTasks.filter(task => task.status === 'completed');
  
  // Calculate percentages based on active tasks
  const totalTasks = activeTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Convert active Task[] to CalendarEvent[] for TaskList
  const taskEvents: CalendarEvent[] = activeTasks
    .slice(0, 5) // Limit to top 5 tasks for better UI
    .map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.due_date || Date.now()),
      type: "task",
      status: task.status,
      isCompleted: task.status === "completed",
      priority: task.priority
    }));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">Active Tasks: {totalTasks}</p>
          <p className="text-sm text-muted-foreground">Completion Rate: {completionRate}%</p>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-xs">Pending: {pendingTasks.length}</span>
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-xs">In Progress: {inProgressTasks.length}</span>
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs">Completed: {completedTasks.length}</span>
        </div>
      </div>
      
      <Progress value={completionRate} className="h-2" />
      
      <ScrollArea className="max-h-[300px] rounded-md border p-1">
        {taskEvents.length > 0 ? (
          <TaskList tasks={taskEvents} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No active tasks found. Create a task to get started.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TasksOverview;
