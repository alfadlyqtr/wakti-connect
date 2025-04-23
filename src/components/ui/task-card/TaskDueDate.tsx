
import React from "react";
import { formatDistanceToNow, isPast, format, isToday, endOfDay } from "date-fns";
import { CalendarIcon, BellOff } from "lucide-react";
import { formatTimeString } from "@/utils/dateTimeFormatter";

interface TaskDueDateProps {
  dueDate: Date;
  dueTime?: string | null;
  status?: string;
  isOverdue?: boolean; // Added this prop
  snoozedUntil?: Date | null;
  snoozeCount?: number;
  isCompleted?: boolean; // Added this prop
  completedDate?: Date | null; // Added this prop
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  dueTime,
  status,
  snoozedUntil,
  snoozeCount = 0,
  isOverdue, // Use the provided isOverdue prop
}) => {
  const formatDueDate = () => {
    if (!dueDate || isNaN(dueDate.getTime())) return "Invalid date";
    
    // For tasks without specific time, treat the due date as end of day
    const effectiveDueDate = dueTime ? dueDate : endOfDay(dueDate);
    
    // Use provided isOverdue prop if available, otherwise calculate it
    const taskIsOverdue = isOverdue !== undefined ? 
      isOverdue : 
      (isPast(effectiveDueDate) && status !== 'completed' && status !== 'archived');
    
    if (taskIsOverdue) {
      return `Overdue: ${formatDistanceToNow(effectiveDueDate, { addSuffix: true })}`;
    }
    
    if (isToday(dueDate)) {
      return dueTime ? `Due today at ${formatTimeString(dueTime)}` : "Due today";
    }
    
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>
          {formatDueDate()}
          {dueTime && !isToday(dueDate) && (
            <span className="font-medium ml-1">at {formatTimeString(dueTime)}</span>
          )}
        </span>
      </div>
      
      {status === 'snoozed' && snoozedUntil && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <BellOff className="h-4 w-4" />
          <span>
            Snoozed until {format(snoozedUntil, 'MMM d')}
            {snoozeCount > 1 && ` (${snoozeCount} times)`}
          </span>
        </div>
      )}
    </div>
  );
};
