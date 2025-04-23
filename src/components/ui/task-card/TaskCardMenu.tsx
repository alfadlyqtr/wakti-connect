
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
  onStatusChange: (id: string, status: string) => void;
  onSnooze?: (id: string, days: number) => void;
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
  onStatusChange,
  onSnooze,
  onRestore,
  userRole,
  isPaidAccount,
}) => {
  const showMarkComplete = status !== "completed" && status !== "archived" && !isArchived;
  const showSnooze = status !== "completed" && status !== "archived" && !isArchived && isPaidAccount;
  const showDelete = !isArchived;
  const showRestore = isArchived && onRestore;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task? It will be archived for 10 days before being permanently deleted.")) {
      onDelete(id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        {showMarkComplete && (
          <DropdownMenuItem onClick={() => onStatusChange(id, "completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Mark Completed
          </DropdownMenuItem>
        )}
        
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
        
        {!isArchived && (
          <DropdownMenuItem onClick={() => onEdit(id)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        
        {showDelete && (
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
        
        {showRestore && (
          <DropdownMenuItem onClick={() => onRestore!(id)}>
            <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
            Restore
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
