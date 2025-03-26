
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskTab } from "@/types/task.types";
import { ClipboardList, Plus, Share, Users } from "lucide-react";

interface EmptyTasksProps {
  tab: TaskTab;
  isPaidAccount: boolean;
  isStaff: boolean;
  onCreateTask: () => void;
}

export const EmptyTasks: React.FC<EmptyTasksProps> = ({
  tab,
  isPaidAccount,
  isStaff,
  onCreateTask
}) => {
  const getEmptyStateContent = () => {
    switch (tab) {
      case "my-tasks":
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: "No tasks yet",
          description: "Create your first task to get started",
          action: !isStaff && (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )
        };
      
      case "shared-tasks":
        return {
          icon: <Share className="h-12 w-12 text-muted-foreground" />,
          title: "No shared tasks",
          description: isPaidAccount 
            ? "Tasks shared with you will appear here" 
            : "Upgrade to a paid plan to share tasks with others",
          action: isPaidAccount ? null : (
            <Button variant="outline">Upgrade Account</Button>
          )
        };
      
      case "assigned-tasks":
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: isStaff ? "No tasks assigned to you" : "No delegated tasks",
          description: isStaff 
            ? "Tasks assigned to you will appear here" 
            : (isPaidAccount ? "Delegate tasks to team members or contacts" : "Upgrade to delegate tasks"),
          action: (!isStaff && isPaidAccount) ? (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          ) : null
        };
      
      case "team-tasks":
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          title: "No team tasks",
          description: isStaff 
            ? "Team tasks will appear here for you to claim" 
            : "Create tasks for your team to work on",
          action: !isStaff && (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team Task
            </Button>
          )
        };
        
      default:
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: "No tasks",
          description: "Start by creating a task",
          action: (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )
        };
    }
  };
  
  const content = getEmptyStateContent();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{content.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{content.description}</p>
      {content.action}
    </div>
  );
};
