
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import RecurringBadge from '@/components/ui/RecurringBadge';
import { TaskStatus, TaskPriority } from '@/types/task.types';
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
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onShare?: (taskId: string) => void;
  onAssign?: (taskId: string) => void;
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
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign
}: TaskCardProps) => {
  const completedSubtasks = subtasks.filter(task => task.is_completed).length;
  const totalSubtasks = subtasks.length;
  
  return (
    <Card className="border-border/40 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="space-y-1 w-5/6">
          <div className="flex items-center gap-2 flex-wrap">
            <TaskStatusIcon status={status} />
            {category && (
              <Badge variant="outline" className="font-normal">
                {category}
              </Badge>
            )}
            {(isRecurring || isRecurringInstance) && (
              <RecurringBadge 
                frequency={recurringFrequency} 
                isRecurringInstance={isRecurringInstance} 
              />
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
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onShare={onShare}
          onAssign={onAssign}
        />
      </CardHeader>
      
      <CardContent className="pb-3">
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
        
        {totalSubtasks > 0 && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {completedSubtasks} of {totalSubtasks} subtasks completed
            </span>
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
        />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
