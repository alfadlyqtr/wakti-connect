
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
  Check,
  Clock,
  Edit2,
  MoreVertical,
  Play,
  Trash2,
} from "lucide-react";

interface TaskCardMenuProps {
  id: string;
  status: TaskStatus;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onSnooze: (id: string, days: number) => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isPaidAccount: boolean;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
  id,
  status,
  onDelete,
  onEdit,
  onStatusChange,
  onSnooze,
  userRole,
  isPaidAccount
}) => {
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
