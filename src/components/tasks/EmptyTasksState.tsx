
import React from "react";
import { ClipboardList, Plus, Share, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskTab } from "@/hooks/useTasks";

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
  if (!isPaidAccount) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Upgrade to Create Tasks</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Task management is available on our Individual and Business plans.
        </p>
        <Button>Upgrade Your Plan</Button>
      </div>
    );
  }

  let title = "";
  let description = "";
  let icon = <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />;
  let buttonText = "Create Task";
  let buttonAction = onCreateTask;
  let showButton = !isStaff;

  if (tab === "my-tasks") {
    if (isStaff) {
      title = "No Tasks Assigned";
      description = "You don't have any tasks assigned to you yet.";
      showButton = false;
    } else {
      title = "No Tasks Yet";
      description = "Create your first task to start tracking your progress.";
      icon = <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />;
    }
  } else if (tab === "shared-tasks") {
    title = "No Shared Tasks";
    description = "Tasks shared with you will appear here.";
    icon = <Share className="h-12 w-12 text-muted-foreground mb-4" />;
    showButton = false;
  } else if (tab === "assigned-tasks") {
    if (isStaff) {
      title = "No Tasks Assigned";
      description = "You don't have any tasks assigned to you yet.";
      showButton = false;
    } else {
      title = "No Assigned Tasks";
      description = "Tasks you assign to others will appear here.";
      icon = <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />;
      buttonText = "Assign Task";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        {description}
      </p>
      {showButton && (
        <Button onClick={buttonAction}>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyTasksState;
