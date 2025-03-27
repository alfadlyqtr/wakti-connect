
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
import { MoreVertical, Edit, Trash2, Bell, XCircle, ArchiveRestore } from "lucide-react";
import { TaskStatus } from "@/types/task.types";

interface TaskCardMenuProps {
  id: string;
  status: TaskStatus;
  isArchived?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onStatusChange?: (id: string, status: string) => void;
  onCancel?: (id: string) => void;
  onRestore?: (id: string) => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isPaidAccount: boolean;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
  id,
  status,
  isArchived = false,
  onDelete,
  onEdit,
  onSnooze,
  onStatusChange,
  onCancel,
  onRestore,
  userRole,
  isPaidAccount,
}) => {
  const canBeEdited = status !== "archived";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        
        {isArchived ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRestore && onRestore(id)}>
              <ArchiveRestore className="mr-2 h-4 w-4" />
              <span>Restore Task</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Permanently</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {canBeEdited && (
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Task</span>
              </DropdownMenuItem>
            )}
            
            {status !== "completed" && isPaidAccount && onSnooze && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Snooze</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onSnooze(id, 1)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Snooze 1 Day</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze(id, 3)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Snooze 3 Days</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze(id, 7)}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Snooze 1 Week</span>
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onCancel && onCancel(id)}
              className="text-amber-600 focus:text-amber-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              <span>Cancel Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Task</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
