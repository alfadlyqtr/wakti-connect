
import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatus } from "@/types/task.types";

interface TaskActionsMenuProps {
  status: TaskStatus;
  userRole: "free" | "individual" | "business";
  isShared?: boolean;
  isAssigned?: boolean;
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({ 
  status, 
  userRole, 
  isShared = false, 
  isAssigned = false 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Task menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        {status !== "completed" ? (
          <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
        ) : (
          <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
        )}
        
        {userRole === "individual" && !isShared && !isAssigned && (
          <DropdownMenuItem>Share Task</DropdownMenuItem>
        )}
        
        {userRole === "business" && !isAssigned && (
          <DropdownMenuItem>Assign to Staff</DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsMenu;
