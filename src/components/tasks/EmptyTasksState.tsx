
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskTab } from "@/types/task.types";
import { ClipboardList, UserPlus, Share2, Users } from "lucide-react";

interface EmptyTasksStateProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
  tab: TaskTab;
  isStaff: boolean;
}

const EmptyTasksState: React.FC<EmptyTasksStateProps> = ({
  isPaidAccount,
  onCreateTask,
  tab,
  isStaff,
}) => {
  // Determine the icon and message based on the active tab
  let icon = <ClipboardList className="h-12 w-12 mb-4 text-muted-foreground" />;
  let title = "No Tasks Found";
  let description = "Get started by creating your first task.";
  let actionButton = (
    <Button onClick={onCreateTask}>Create Your First Task</Button>
  );

  switch (tab) {
    case "shared-tasks":
      icon = <Share2 className="h-12 w-12 mb-4 text-muted-foreground" />;
      title = "No Shared Tasks";
      description = "When someone shares a task with you, it will appear here.";
      actionButton = null;
      break;

    case "assigned-tasks":
      icon = <UserPlus className="h-12 w-12 mb-4 text-muted-foreground" />;
      title = "No Assigned Tasks";
      description = isStaff
        ? "Tasks assigned to you will appear here."
        : "Tasks you've assigned to others will appear here.";
      actionButton = !isStaff ? (
        <Button onClick={onCreateTask}>Create Task to Assign</Button>
      ) : null;
      break;
      
    case "team-tasks":
      icon = <Users className="h-12 w-12 mb-4 text-muted-foreground" />;
      title = "No Team Tasks";
      description = "Team tasks allow you to manage work across your organization.";
      actionButton = (
        <Button onClick={onCreateTask}>Create Your First Team Task</Button>
      );
      break;

    default:
      // Handle "my-tasks" case
      if (!isPaidAccount) {
        description =
          "Free accounts can create one task per month. Upgrade for unlimited tasks!";
      }
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyTasksState;
