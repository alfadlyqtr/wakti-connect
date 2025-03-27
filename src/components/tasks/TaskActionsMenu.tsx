
import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  Trash, 
  Clock, 
  CheckSquare, 
  SquarePen, 
  Share, 
  UserPlus,
  Calendar,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";

interface TaskActionsMenuProps {
  userRole: "free" | "individual" | "business" | "staff";
  isShared?: boolean;
  isAssigned?: boolean;
  isTeamTask?: boolean;
  status?: TaskStatus;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onShare?: (taskId: string) => void;
  onAssign?: (taskId: string) => void;
  onSnooze?: (taskId: string, days: number) => void;
  taskId: string;
  snoozeCount?: number;
}

export function TaskActionsMenu({
  userRole,
  isShared = false,
  isAssigned = false,
  isTeamTask = false,
  status = "pending" as TaskStatus,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onSnooze,
  taskId,
  snoozeCount = 0
}: TaskActionsMenuProps) {
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  const canAssignTasks = userRole === "business" || userRole === "staff";
  
  const handleAction = (action: (id: string, ...args: any[]) => void, ...args: any[]) => {
    if (action) {
      action(taskId, ...args);
    } else {
      console.log("No handler provided for this action", { action, taskId });
    }
  };
  
  const canEditTask = userRole === "business" || (userRole !== "staff" && !isTeamTask);
  const canDeleteTask = userRole === "business" || (userRole !== "staff" && !isTeamTask);
  
  const handleAssignClick = () => {
    console.log("Task assignment functionality disabled");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {canEditTask && (
          <DropdownMenuItem onClick={() => handleAction(onEdit)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        
        {canDeleteTask && (
          <DropdownMenuItem onClick={() => handleAction(onDelete)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {status !== "completed" && (
          <DropdownMenuItem onClick={() => handleAction(onStatusChange, "completed")}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark Complete
          </DropdownMenuItem>
        )}
        
        {status !== "in-progress" && (
          <DropdownMenuItem onClick={() => handleAction(onStatusChange, "in-progress")}>
            <SquarePen className="h-4 w-4 mr-2" />
            Mark In Progress
          </DropdownMenuItem>
        )}
        
        {status !== "pending" as TaskStatus && (
          <DropdownMenuItem onClick={() => handleAction(onStatusChange, "pending")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark Pending
          </DropdownMenuItem>
        )}
        
        {isPaidAccount && status !== "completed" && onSnooze && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Bell className="h-4 w-4 mr-2" />
                Snooze Task
                {snoozeCount > 0 && (
                  <span className="ml-1 text-xs bg-muted px-1 rounded">
                    x{snoozeCount}
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleAction(onSnooze, 1)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  1 Day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction(onSnooze, 3)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  3 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction(onSnooze, 7)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  1 Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction(onSnooze, 14)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  2 Weeks
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
        
        {isPaidAccount && !isShared && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction(onShare)}>
              <Share className="h-4 w-4 mr-2" />
              Share Task
            </DropdownMenuItem>
          </>
        )}
        
        {canAssignTasks && !isAssigned && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleAssignClick}
              className="opacity-50"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Task (Disabled)
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
