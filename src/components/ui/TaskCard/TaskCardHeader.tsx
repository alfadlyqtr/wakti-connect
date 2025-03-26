
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskPriority } from "@/types/task.types";
import { Repeat, Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardHeaderProps {
  title: string;
  priority: TaskPriority;
  isRecurring?: boolean;
  isCompleted: boolean;
  isShared?: boolean;
  delegatedEmail?: string | null;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  title,
  priority,
  isRecurring,
  isCompleted,
  isShared,
  delegatedEmail
}) => {
  return (
    <div className="flex justify-between items-start gap-2 mb-2">
      <div className="flex-1">
        <h3 className={`font-medium text-base ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
          {title}
        </h3>
        
        {delegatedEmail && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span>Delegated to:</span>
            <span className="font-medium">{delegatedEmail}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1.5">
        {isRecurring && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-gray-500">
                <Repeat className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Recurring task</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {isShared && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-gray-500">
                <Share2 className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Shared task</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Badge 
          className={`${
            priority === 'urgent' ? 'bg-red-500 hover:bg-red-600' : 
            priority === 'high' ? 'bg-orange-500 hover:bg-orange-600' : 
            priority === 'medium' ? 'bg-amber-500 hover:bg-amber-600' : 
            'bg-green-500 hover:bg-green-600'
          }`}
        >
          {priority}
        </Badge>
      </div>
    </div>
  );
};
