
import React from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  Trash, 
  Clock, 
  CheckSquare, 
  SquarePen, 
  Share, 
  UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";

interface TaskActionsMenuProps {
  userRole: "free" | "individual" | "business" | "staff";
  isShared?: boolean;
  isAssigned?: boolean;
  status?: TaskStatus;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onShare?: (taskId: string) => void;
  onAssign?: (taskId: string) => void;
  taskId?: string;
}

export function TaskActionsMenu({
  userRole,
  isShared = false,
  isAssigned = false,
  status = "pending",
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  taskId = ""
}: TaskActionsMenuProps) {
  // Update isPaidAccount to include staff as a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";
  
  // Only business and staff should see assign option
  const canAssignTasks = userRole === "business" || userRole === "staff";
  
  // Handle dummy click events when no handlers provided
  const handleAction = (action: (id: string, ...args: any[]) => void, ...args: any[]) => {
    if (action && taskId) {
      action(taskId, ...args);
    } else {
      console.log("No handler provided for this action or taskId is missing");
    }
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
        
        <DropdownMenuItem onClick={() => onEdit && handleAction(onEdit)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDelete && handleAction(onDelete)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {status !== "completed" && (
          <DropdownMenuItem onClick={() => onStatusChange && handleAction(onStatusChange, "completed")}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark Complete
          </DropdownMenuItem>
        )}
        
        {status !== "in-progress" && (
          <DropdownMenuItem onClick={() => onStatusChange && handleAction(onStatusChange, "in-progress")}>
            <SquarePen className="h-4 w-4 mr-2" />
            Mark In Progress
          </DropdownMenuItem>
        )}
        
        {status !== "pending" && (
          <DropdownMenuItem onClick={() => onStatusChange && handleAction(onStatusChange, "pending")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark Pending
          </DropdownMenuItem>
        )}
        
        {isPaidAccount && !isShared && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onShare && handleAction(onShare)}>
              <Share className="h-4 w-4 mr-2" />
              Share Task
            </DropdownMenuItem>
          </>
        )}
        
        {canAssignTasks && !isAssigned && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAssign && handleAction(onAssign)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Task
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
