
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2,
  AlarmClock,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";

interface TaskCardMenuProps {
  id: string;
  status: TaskStatus;
  isArchived?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel?: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onRestore?: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isPaidAccount: boolean;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
  id,
  status,
  isArchived = false,
  onDelete,
  onEdit,
  onCancel,
  onSnooze,
  onRestore,
  onStatusChange,
  userRole,
  isPaidAccount,
}) => {
  // Handle status change
  const startTask = () => {
    onStatusChange(id, "in-progress");
  };

  // Determine which menu items to show based on status
  const showMarkComplete = status !== "completed" && status !== "archived";
  const showSnooze = status !== "completed" && status !== "archived" && isPaidAccount;
  const showStartTask = status === "snoozed" || status === "late";
  const showCancel = status !== "completed" && status !== "archived" && onCancel;
  const showDelete = !isArchived;
  const showRestore = isArchived && onRestore;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        
        {/* Status actions */}
        {showMarkComplete && (
          <DropdownMenuItem onClick={() => onStatusChange(id, "completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Mark as completed
          </DropdownMenuItem>
        )}
        
        {showStartTask && (
          <DropdownMenuItem onClick={startTask}>
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            Start task
          </DropdownMenuItem>
        )}
        
        {/* Snooze options for paid accounts */}
        {showSnooze && onSnooze && (
          <>
            <DropdownMenuLabel>Snooze</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSnooze(id, 1)}>
              <AlarmClock className="mr-2 h-4 w-4 text-purple-500" />
              Snooze for 1 day
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSnooze(id, 3)}>
              <AlarmClock className="mr-2 h-4 w-4 text-purple-500" />
              Snooze for 3 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSnooze(id, 7)}>
              <AlarmClock className="mr-2 h-4 w-4 text-purple-500" />
              Snooze for 1 week
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Edit option */}
        {!isArchived && (
          <DropdownMenuItem onClick={() => onEdit(id)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        
        {/* Cancel option */}
        {showCancel && onCancel && (
          <DropdownMenuItem onClick={() => onCancel(id)}>
            <XCircle className="mr-2 h-4 w-4 text-orange-500" />
            Cancel task
          </DropdownMenuItem>
        )}
        
        {/* Delete option */}
        {showDelete && (
          <DropdownMenuItem onClick={() => onDelete(id)}>
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            Delete
          </DropdownMenuItem>
        )}
        
        {/* Restore option for archived tasks */}
        {showRestore && (
          <DropdownMenuItem onClick={() => onRestore(id)}>
            <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
            Restore
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
