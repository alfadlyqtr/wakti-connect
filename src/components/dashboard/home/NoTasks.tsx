
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface NoTasksProps {
  message: string;
  onCreateTask: () => void;
}

export const NoTasks: React.FC<NoTasksProps> = ({ message, onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <PlusCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{message}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Create your first task to get started
      </p>
      <Button onClick={onCreateTask}>
        Create Task
      </Button>
    </div>
  );
};
