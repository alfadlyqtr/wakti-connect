
import React from "react";
import { format, parseISO, isAfter, isToday } from "date-fns";
import { TaskStatus } from "@/types/task.types";
import { CalendarClock, Clock } from "lucide-react";

interface TaskDueDateProps {
  dueDate: Date | string;
  dueTime: string | null | undefined;
  status: TaskStatus;
  snoozedUntil?: Date | string | null;
  snoozeCount?: number;
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  dueTime,
  status,
  snoozedUntil,
  snoozeCount
}) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return 'Today';
    }
    
    return format(dateObj, 'MMM d, yyyy');
  };
  
  const isOverdue = (date: Date | string, status: TaskStatus) => {
    if (status === 'completed' || status === 'snoozed') return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    return isAfter(now, dateObj) && !isToday(dateObj);
  };
  
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const overdue = isOverdue(dueDateObj, status);
  
  return (
    <div className="mt-2 mb-3">
      {status === 'snoozed' && snoozedUntil ? (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>
            Snoozed until {formatDate(snoozedUntil)}
            {snoozeCount && snoozeCount > 1 ? ` (${snoozeCount} times)` : ''}
          </span>
        </div>
      ) : (
        <div className={`flex items-center text-sm ${overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>
            Due {formatDate(dueDateObj)}
            {dueTime && ` at ${dueTime}`}
            {overdue && ' (Overdue)'}
          </span>
        </div>
      )}
    </div>
  );
};
