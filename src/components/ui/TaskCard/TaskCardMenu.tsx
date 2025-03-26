
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";
import {
  Archive,
  Check,
  Clock,
  Edit2,
  MoreVertical,
  Play,
  Share2,
  Trash2,
  User,
} from "lucide-react";

interface TaskCardMenuProps {
  id: string;
  status: TaskStatus;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare: (id: string) => void;
  onAssign: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isAssigned: boolean;
  isBusinessOrStaff: boolean;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
  id,
  status,
  onDelete,
  onEdit,
  onStatusChange,
  onShare,
  onSnooze,
  userRole,
  isAssigned,
  isBusinessOrStaff,
}) => {
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";
  
  // Placeholder function for assign that does nothing
  const handleAssign = () => {
    console.log("Task assignment functionality disabled");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onEdit(id)}>
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        
        {status !== "completed" && (
          <DropdownMenuItem onClick={() => onStatusChange(id, "completed")}>
            <Check className="mr-2 h-4 w-4" />
            <span>Mark Complete</span>
          </DropdownMenuItem>
        )}
        
        {status !== "in-progress" && status !== "completed" && (
          <DropdownMenuItem onClick={() => onStatusChange(id, "in-progress")}>
            <Play className="mr-2 h-4 w-4" />
            <span>Start Progress</span>
          </DropdownMenuItem>
        )}
        
        {isPaidAccount && status !== "completed" && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => onShare(id)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share Task</span>
            </DropdownMenuItem>
            
            {isBusinessOrStaff && !isAssigned && (
              <DropdownMenuItem onClick={handleAssign}>
                <User className="mr-2 h-4 w-4" />
                <span>Assign Task</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => onSnooze(id, 1)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Snooze 1 Day</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onSnooze(id, 3)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Snooze 3 Days</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onSnooze(id, 7)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Snooze 1 Week</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(id)}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
