
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";
import { Check, Clock, ThumbsUp, Loader2 } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { TaskCardCompletionAnimation } from "./TaskCardCompletionAnimation";

interface TaskCardFooterProps {
  id: string;
  status: TaskStatus;
  completedDate: Date | string | null;
  dueDate: Date;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
  id,
  status,
  completedDate,
  dueDate,
  onStatusChange,
  onEdit,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAheadOfTime, setIsAheadOfTime] = useState(false);
  
  // Check if task is completed
  const isCompleted = status === "completed";
  const isArchived = status === "archived";
  
  // Handle completing a task
  const handleComplete = () => {
    // Determine if task is being completed ahead of time
    const isEarly = !isPast(dueDate) && !isToday(dueDate);
    setIsAheadOfTime(isEarly);
    
    // Show animation and then update task status
    setShowAnimation(true);
    
    // Status will be updated after animation completes
  };
  
  // Update task status after animation completes
  const handleAnimationComplete = () => {
    setShowAnimation(false);
    onStatusChange(id, "completed");
  };
  
  // Don't show controls for archived tasks
  if (isArchived) {
    return null;
  }
  
  return (
    <div className="px-4 py-3 bg-muted/40 flex items-center justify-between">
      {isCompleted ? (
        <div className="text-xs text-muted-foreground flex items-center">
          <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
          {completedDate ? (
            <>
              Completed on {format(new Date(completedDate), "MMM d, yyyy")}
            </>
          ) : (
            "Completed"
          )}
        </div>
      ) : (
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            onClick={handleComplete}
          >
            <Check className="mr-1 h-4 w-4" />
            Complete
          </Button>
          
          {/* In-progress indicator - not a button anymore */}
          {status === "in-progress" && (
            <span className="inline-flex items-center h-8 px-3 py-2 text-xs rounded-md bg-blue-50 text-blue-600 border border-blue-200">
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              In Progress
            </span>
          )}
        </div>
      )}
      
      {/* Edit button removed from here - now only in dropdown menu */}
      
      {/* Completion animation */}
      <TaskCardCompletionAnimation 
        show={showAnimation}
        isAheadOfTime={isAheadOfTime}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
};
