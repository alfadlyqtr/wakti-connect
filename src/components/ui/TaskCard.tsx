
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import RecurringBadge from '@/components/ui/RecurringBadge';
import { TaskStatus, TaskPriority, SubTask } from '@/types/task.types';
import TaskStatusIcon from '@/components/tasks/TaskStatusIcon';
import { TaskActionsMenu } from '@/components/tasks/TaskActionsMenu';
import TaskBadges from '@/components/tasks/TaskBadges';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Clock } from 'lucide-react';

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
  subtasks?: { id?: string; content: string; is_completed: boolean; due_date?: string | null; due_time?: string | null }[];
  completedDate?: Date | null;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  dueTime?: string | null;
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
  dueTime,
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
  const [expandedSubtasks, setExpandedSubtasks] = useState(false);
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
              <button 
                onClick={() => setExpandedSubtasks(!expandedSubtasks)}
                className="flex items-center text-xs hover:text-primary transition-colors"
              >
                {expandedSubtasks ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                <span>Subtasks: {completedSubtasks}/{totalSubtasks}</span>
              </button>
              <span>{Math.round(subtaskProgress)}%</span>
            </div>
            <Progress value={subtaskProgress} className="h-1.5" />
            
            {expandedSubtasks ? (
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="pt-0.5">
                      <input 
                        type="checkbox"
                        className="rounded text-primary"
                        checked={subtask.is_completed}
                        onChange={(e) => onSubtaskToggle?.(id, index, e.target.checked)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className={cn(
                        "text-xs",
                        subtask.is_completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.content}
                      </div>
                      {(subtask.due_date || subtask.due_time) && (
                        <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          {subtask.due_date && format(new Date(subtask.due_date), 'MMM d')}
                          {subtask.due_time && subtask.due_date && ' at '}
                          {subtask.due_time && subtask.due_time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2">
                {subtasks.slice(0, 2).map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      className="rounded text-primary"
                      checked={subtask.is_completed}
                      onChange={(e) => onSubtaskToggle?.(id, index, e.target.checked)}
                    />
                    <span className={cn(
                      "text-xs line-clamp-1",
                      subtask.is_completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.content}
                    </span>
                  </div>
                ))}
                {totalSubtasks > 2 && (
                  <div className="text-xs text-muted-foreground text-center mt-1 cursor-pointer hover:text-primary" onClick={() => setExpandedSubtasks(true)}>
                    +{totalSubtasks - 2} more subtasks
                  </div>
                )}
              </div>
            )}
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
          dueTime={dueTime}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
