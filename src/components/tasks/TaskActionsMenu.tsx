
import React, { useEffect, useState } from "react";
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
import { isUserStaff } from "@/utils/staffUtils";

interface TaskActionsMenuProps {
  status: TaskStatus;
  userRole: "free" | "individual" | "business" | "staff";
  isShared?: boolean;
  isAssigned?: boolean;
  isCreator?: boolean;
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({ 
  status, 
  userRole, 
  isShared = false, 
  isAssigned = false,
  isCreator = true
}) => {
  const [isStaff, setIsStaff] = useState(false);
  
  useEffect(() => {
    // Check if localStorage has staff status for quick loading
    if (localStorage.getItem('isStaff') === 'true') {
      setIsStaff(true);
    } else {
      isUserStaff().then(staffStatus => {
        setIsStaff(staffStatus);
      });
    }
  }, []);
  
  // Staff can only change status, not edit or delete tasks
  if (isStaff || userRole === 'staff') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Task menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {status !== "completed" ? (
            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
          ) : (
            <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Task menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isCreator && <DropdownMenuItem>Edit</DropdownMenuItem>}
        {status !== "completed" ? (
          <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
        ) : (
          <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
        )}
        
        {userRole === "individual" && !isShared && !isAssigned && isCreator && (
          <DropdownMenuItem>Share Task</DropdownMenuItem>
        )}
        
        {userRole === "business" && !isAssigned && isCreator && (
          <DropdownMenuItem>Assign to Staff</DropdownMenuItem>
        )}
        
        {isCreator && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsMenu;
