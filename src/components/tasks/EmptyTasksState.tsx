
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface EmptyTasksStateProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
}

export const EmptyTasksState: React.FC<EmptyTasksStateProps> = ({ 
  isPaidAccount,
  onCreateTask
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No tasks yet</h3>
      <p className="text-muted-foreground max-w-md mt-2 mb-4">
        {isPaidAccount
          ? "Create your first task to start organizing your work."
          : "Free accounts can create 1 task. Create your first task now!"}
      </p>
      <Button onClick={onCreateTask}>
        Create Task
      </Button>
    </div>
  );
};
