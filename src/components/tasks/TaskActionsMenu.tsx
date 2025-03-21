
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
import { TaskWithSharedInfo } from "@/hooks/useTasks";

interface TaskActionsMenuProps {
  task: TaskWithSharedInfo;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onShare: (taskId: string) => void;
  onAssign?: (taskId: string) => void;
  showShareOption?: boolean;
  showAssignOption?: boolean;
  userRole: "free" | "individual" | "business" | "staff";
}

export function TaskActionsMenu({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  showShareOption = true,
  showAssignOption = false,
  userRole
}: TaskActionsMenuProps) {
  // Update isPaidAccount to include staff as a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";
  
  // Only business and staff should see assign option
  const canAssignTasks = userRole === "business" || userRole === "staff";
  
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
        
        <DropdownMenuItem onClick={() => onEdit(task.id)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDelete(task.id)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {task.status !== "completed" && (
          <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark Complete
          </DropdownMenuItem>
        )}
        
        {task.status !== "in-progress" && (
          <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>
            <SquarePen className="h-4 w-4 mr-2" />
            Mark In Progress
          </DropdownMenuItem>
        )}
        
        {task.status !== "pending" && (
          <DropdownMenuItem onClick={() => onStatusChange(task.id, "pending")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark Pending
          </DropdownMenuItem>
        )}
        
        {isPaidAccount && showShareOption && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onShare(task.id)}>
              <Share className="h-4 w-4 mr-2" />
              Share Task
            </DropdownMenuItem>
          </>
        )}
        
        {showAssignOption && canAssignTasks && onAssign && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAssign(task.id)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Task
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
