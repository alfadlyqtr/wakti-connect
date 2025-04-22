import React from "react";
import { TaskList } from "./TaskList";
import { Task, TaskStatus } from "@/types/task.types";
import { CalendarEvent } from "@/types/calendar.types";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Active Tasks: {totalTasks}</p>
              <p className="text-sm text-muted-foreground">Completion Rate: {completionRate}%</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/50" />
                <span className="text-xs">Pending: {pendingTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-blue-500/80 shadow-sm shadow-blue-500/50" />
                <span className="text-xs">In Progress: {inProgressTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-sm shadow-green-500/50" />
                <span className="text-xs">Completed: {completedTasks.length}</span>
              </div>
            </div>
          </div>
          
          <Progress 
            value={completionRate} 
            className={cn(
              "h-2 transition-all duration-500",
              completionRate > 80 ? "bg-green-200" : 
              completionRate > 50 ? "bg-blue-200" : 
              "bg-amber-200"
            )}
          />
          
          <ScrollArea className="h-[300px] rounded-lg border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 shadow-inner">
            <div className="p-4">
              {taskEvents.length > 0 ? (
                <TaskList tasks={taskEvents} />
              ) : (
                <div className="text-center text-muted-foreground">
                  No active tasks found. Create a task to get started.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default TasksOverview;
