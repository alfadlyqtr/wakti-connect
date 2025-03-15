
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmptyTasksStateProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
}

const EmptyTasksState = ({ isPaidAccount, onCreateTask }: EmptyTasksStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M8 12h8M12 8v8" />
      </svg>
      <h3 className="text-lg font-semibold">No tasks found</h3>
      <p className="text-center text-sm text-muted-foreground max-w-xs">
        {isPaidAccount 
          ? "You haven't created any tasks yet. Start by creating a new task to organize your work."
          : "Free accounts can only view tasks. Upgrade to create and manage tasks."}
      </p>
      {isPaidAccount ? (
        <Button onClick={onCreateTask} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Task
        </Button>
      ) : (
        <div className="text-center">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 mb-2">
            View Only
          </Badge>
          <p className="text-xs text-muted-foreground">
            Upgrade to create and manage tasks
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyTasksState;
