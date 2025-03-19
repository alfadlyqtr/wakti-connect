
import React from "react";
import { ClipboardCheck, Plus, Share2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskTab } from "@/types/task.types";

interface EmptyTasksStateProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
  type: TaskTab;
}

const EmptyTasksState = ({ isPaidAccount, onCreateTask, type }: EmptyTasksStateProps) => {
  // Different content based on the current tab
  const content = {
    "my-tasks": {
      icon: <ClipboardCheck className="h-12 w-12 text-muted-foreground" />,
      title: "No Tasks Created Yet",
      description: "Create your first task to get started with task management.",
      buttonText: "Create Task"
    },
    "shared-tasks": {
      icon: <Share2 className="h-12 w-12 text-muted-foreground" />,
      title: "No Shared Tasks",
      description: "You don't have any tasks shared with you yet.",
      buttonText: "Create Task"
    },
    "assigned-tasks": {
      icon: <UserCheck className="h-12 w-12 text-muted-foreground" />,
      title: "No Assigned Tasks",
      description: "You don't have any tasks assigned to you yet.",
      buttonText: "Assign Task"
    }
  };
  
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      {content[type].icon}
      
      <h3 className="mt-4 text-lg font-semibold">
        {content[type].title}
      </h3>
      
      <p className="mt-2 text-muted-foreground max-w-sm">
        {content[type].description}
      </p>
      
      {isPaidAccount && (
        <Button onClick={onCreateTask} className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          {content[type].buttonText}
        </Button>
      )}
      
      {!isPaidAccount && (
        <div className="mt-4 text-sm text-muted-foreground">
          Upgrade to Individual or Business plan to create and manage tasks.
        </div>
      )}
    </div>
  );
};

export default EmptyTasksState;
