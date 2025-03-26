
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskTab } from "@/types/task.types";
import { 
  Clipboard, 
  Share2, 
  Users,
  UserCheck
} from "lucide-react";

interface EmptyTasksStateProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
  tab: TaskTab;
  isStaff?: boolean;
}

const EmptyTasksState: React.FC<EmptyTasksStateProps> = ({
  isPaidAccount,
  onCreateTask,
  tab,
  isStaff = false
}) => {
  // Content based on tab and user type
  const getContent = () => {
    if (isStaff) {
      if (tab === "assigned-tasks") {
        return {
          icon: <Clipboard className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Tasks Assigned",
          description: "You don't have any tasks assigned to you yet.",
          action: null
        };
      } else if (tab === "team-tasks") {
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Team Tasks Available",
          description: "There are no team tasks available to claim at the moment.",
          action: null
        };
      }
    }

    switch (tab) {
      case "my-tasks":
        return {
          icon: <Clipboard className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Tasks Created",
          description: "You haven't created any tasks yet.",
          action: isPaidAccount ? (
            <Button onClick={onCreateTask}>Create Your First Task</Button>
          ) : (
            <Button onClick={onCreateTask} variant="outline">
              Create Task (1 free task/month)
            </Button>
          )
        };
      case "shared-tasks":
        return {
          icon: <Share2 className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Shared Tasks",
          description: "No tasks have been shared with you yet.",
          action: null
        };
      case "assigned-tasks":
        return {
          icon: <UserCheck className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Assigned Tasks",
          description: "You haven't assigned any tasks to staff or team members.",
          action: isPaidAccount ? (
            <Button onClick={onCreateTask}>Create Task to Assign</Button>
          ) : null
        };
      case "team-tasks":
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Team Tasks",
          description: "Create tasks for your team to claim and work on.",
          action: isPaidAccount ? (
            <Button onClick={onCreateTask}>Create Team Task</Button>
          ) : null
        };
      default:
        return {
          icon: <Clipboard className="h-12 w-12 text-muted-foreground opacity-50" />,
          title: "No Tasks",
          description: "You don't have any tasks yet.",
          action: isPaidAccount ? (
            <Button onClick={onCreateTask}>Create Task</Button>
          ) : null
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {content.icon}
      <h3 className="mt-4 text-lg font-medium">{content.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {content.description}
      </p>
      {content.action && <div className="mt-6">{content.action}</div>}
    </div>
  );
};

export default EmptyTasksState;
