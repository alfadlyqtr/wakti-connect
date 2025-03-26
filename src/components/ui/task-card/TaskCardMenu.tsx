
import React from "react";
import { Button } from "@/components/ui/button";
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
  CheckIcon, 
  PlayIcon, 
  PauseIcon, 
  PenIcon, 
  TrashIcon, 
  Share2Icon, 
  UsersIcon, 
  BellOff 
} from "lucide-react";
import { TaskStatus } from "@/types/task.types";

interface TaskCardMenuProps {
  id: string;
  status: TaskStatus;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare?: (id: string) => void;
  onAssign?: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
  id,
  status,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  onSnooze
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {status !== 'completed' && (
          <DropdownMenuItem onClick={() => onStatusChange(id, 'completed')}>
            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
            <span>Mark Complete</span>
          </DropdownMenuItem>
        )}
        
        {status !== 'in-progress' && status !== 'completed' && (
          <DropdownMenuItem onClick={() => onStatusChange(id, 'in-progress')}>
            <PlayIcon className="mr-2 h-4 w-4 text-blue-500" />
            <span>Mark In Progress</span>
          </DropdownMenuItem>
        )}
        
        {status !== 'pending' && status !== 'completed' && (
          <DropdownMenuItem onClick={() => onStatusChange(id, 'pending')}>
            <PauseIcon className="mr-2 h-4 w-4 text-amber-500" />
            <span>Mark Pending</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onEdit(id)}>
          <PenIcon className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
        
        {onShare && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onShare(id)}>
              <Share2Icon className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
          </>
        )}
        
        {onAssign && (
          <DropdownMenuItem onClick={() => onAssign(id)}>
            <UsersIcon className="mr-2 h-4 w-4" />
            <span>Assign</span>
          </DropdownMenuItem>
        )}
        
        {onSnooze && status !== 'completed' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Snooze For</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSnooze(id, 1)}>
              <BellOff className="mr-2 h-4 w-4" />
              <span>1 Day</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSnooze(id, 3)}>
              <BellOff className="mr-2 h-4 w-4" />
              <span>3 Days</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSnooze(id, 7)}>
              <BellOff className="mr-2 h-4 w-4" />
              <span>1 Week</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
