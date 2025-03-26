
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { 
  TaskCardHeader, 
  TaskDueDate, 
  TaskSubtasks, 
  TaskClaimButton, 
  TaskCardFooter 
} from "@/components/ui/task-card";
import { isPast } from "date-fns";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isAssigned?: boolean;
  isShared?: boolean;
  subtasks?: SubTask[];
  completedDate?: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  delegatedEmail?: string | null;
  assigneeId?: string | null;
  refetch?: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare?: (id: string) => void;
  onAssign?: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  dueDate,
  dueTime,
  status,
  priority,
  userRole,
  isAssigned,
  isShared,
  subtasks = [],
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount = 0,
  snoozedUntil,
  delegatedEmail,
  assigneeId,
  refetch,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  onSnooze,
  onSubtaskToggle
}) => {
  const isOverdue = status !== 'completed' && 
                    status !== 'snoozed' && 
                    isPast(dueDate) && 
                    dueDate.getTime() < new Date().getTime();
                    
  const isDelegatedViaEmail = !!delegatedEmail && !assigneeId;
  
  // No longer used but kept to match original API
  const isTeamTask = status !== 'completed' && !assigneeId && userRole === 'staff';

  return (
    <Card className={`border-l-4 ${isOverdue ? 'border-l-red-500' : `border-l-${priority === 'urgent' ? 'red-600' : priority === 'high' ? 'red-500' : priority === 'medium' ? 'amber-500' : 'green-500'}`}`}>
      <TaskCardHeader
        id={id}
        title={title}
        status={status}
        priority={priority}
        isRecurring={isRecurring}
        isRecurringInstance={isRecurringInstance}
        isAssigned={isAssigned}
        isShared={isShared}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onShare={userRole !== 'free' ? onShare : undefined}
        onAssign={userRole === 'business' ? onAssign : undefined}
        onSnooze={onSnooze}
      />
      
      <CardContent className="pb-2">
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <TaskDueDate
          dueDate={dueDate}
          dueTime={dueTime}
          status={status}
          snoozedUntil={snoozedUntil}
          snoozeCount={snoozeCount}
        />
        
        <TaskSubtasks
          taskId={id}
          subtasks={subtasks}
          onSubtaskToggle={onSubtaskToggle}
          refetch={refetch}
        />
        
        {isDelegatedViaEmail && delegatedEmail && (
          <TaskClaimButton 
            taskId={id} 
            delegatedEmail={delegatedEmail} 
            refetch={refetch} 
          />
        )}
      </CardContent>
      
      <TaskCardFooter
        id={id}
        status={status}
        completedDate={completedDate}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />
    </Card>
  );
};

export default TaskCard;
