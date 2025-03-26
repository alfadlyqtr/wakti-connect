
import React from "react";
import { Loader2 } from "lucide-react";

const TasksLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and track your progress.
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
          <span className="ml-2">Loading tasks...</span>
        </div>
      </div>
    </div>
  );
};

export default TasksLoading;
