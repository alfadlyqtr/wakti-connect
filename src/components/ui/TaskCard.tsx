
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import RecurringBadge from '@/components/ui/RecurringBadge';
import { TaskStatus, TaskPriority, SubTask } from '@/types/task.types';
import TaskStatusIcon from '@/components/tasks/TaskStatusIcon';
import { TaskActionsMenu } from '@/components/tasks/TaskActionsMenu';
import TaskBadges from '@/components/tasks/TaskBadges';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isAssigned?: boolean;
  isShared?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: string;
  isRecurringInstance?: boolean;
  subtasks?: { content: string; is_completed: boolean }[];
  completedDate?: Date | null;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onShare?: (taskId: string) => void;
  onAssign?: (taskId: string) => void;
  onSnooze?: (taskId: string, days: number) => void;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  status,
  priority,
  category,
  userRole,
  isAssigned = false,
  isShared = false,
  isRecurring = false,
  recurringFrequency,
  isRecurringInstance = false,
  subtasks = [],
  completedDate = null,
  snoozeCount = 0,
  snoozedUntil = null,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  onSnooze,
  onSubtaskToggle
}: TaskCardProps) => {
  const completedSubtasks = subtasks.filter(task => task.is_completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  
  return (
    <Card className="border-border/40 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="space-y-1 w-5/6">
          <div className="flex items-center gap-2 flex-wrap">
            <TaskStatusIcon status={status} />
            {(isRecurring || isRecurringInstance) && (
              <RecurringBadge 
                frequency={recurringFrequency} 
                isRecurringInstance={isRecurringInstance} 
              />
            )}
            {snoozeCount > 0 && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
                Snoozed x{snoozeCount}
              </Badge>
            )}
          </div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
        </div>
        <TaskActionsMenu 
          userRole={userRole || "free"} 
          isShared={isShared} 
          isAssigned={isAssigned}
          status={status}
          taskId={id}
          snoozeCount={snoozeCount}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onShare={onShare}
          onAssign={onAssign}
          onSnooze={onSnooze}
        />
      </CardHeader>
      
      <CardContent className="pb-3">
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {description}
          </p>
        )}
        
        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Subtasks: {completedSubtasks}/{totalSubtasks}</span>
              <span>{Math.round(subtaskProgress)}%</span>
            </div>
            <Progress value={subtaskProgress} className="h-1.5" />
            
            <div className="mt-2 space-y-1">
              {subtasks.slice(0, 3).map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    className="rounded text-primary"
                    checked={subtask.is_completed}
                    onChange={(e) => onSubtaskToggle?.(id, index, e.target.checked)}
                  />
                  <span className={cn(
                    "text-xs",
                    subtask.is_completed && "line-through text-muted-foreground"
                  )}>
                    {subtask.content}
                  </span>
                </div>
              ))}
              {totalSubtasks > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{totalSubtasks - 3} more subtasks
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <TaskBadges 
          dueDate={dueDate} 
          priority={priority} 
          isAssigned={isAssigned} 
          isShared={isShared}
          status={status}
          completedDate={completedDate}
          snoozedUntil={snoozedUntil}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
