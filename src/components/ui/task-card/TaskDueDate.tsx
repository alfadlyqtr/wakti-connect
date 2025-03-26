
import React from "react";
import { formatDistanceToNow, isPast, format } from "date-fns";
import { CalendarIcon, BellOff } from "lucide-react";
import { formatTimeString } from "@/utils/dateTimeFormatter";

interface TaskDueDateProps {
  dueDate: Date;
  dueTime?: string | null;
  status: string;
  snoozedUntil?: Date | null;
  snoozeCount?: number;
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  dueTime,
  status,
  snoozedUntil,
  snoozeCount = 0
}) => {
  const formatDueDate = () => {
    if (!dueDate || isNaN(dueDate.getTime())) return "Invalid date";
    
    if (isPast(dueDate) && status !== 'completed') {
      return `Overdue: ${formatDistanceToNow(dueDate, { addSuffix: true })}`;
    }
    
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>
          {formatDueDate()}
          {dueTime && (
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
