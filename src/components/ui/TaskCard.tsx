
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCard/TaskCardHeader";
import { TaskCardMenu } from "./TaskCard/TaskCardMenu";
import { TaskCardFooter } from "./task-card/TaskCardFooter";
import { TaskDueDate } from "./task-card/TaskDueDate";
import { TaskSubtasks } from "./task-card/TaskSubtasks";
import { useTranslation } from "react-i18next";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isArchived?: boolean;
  subtasks?: SubTask[];
  completedDate?: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  refetch?: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCancel?: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onRestore?: (id: string) => void;
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
  isArchived = false,
  subtasks = [],
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount = 0,
  snoozedUntil,
  refetch,
  onEdit,
  onDelete,
  onCancel,
  onStatusChange,
  onSnooze,
  onRestore,
  onSubtaskToggle
}) => {
  const { t } = useTranslation();
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  // Show or hide certain features based on the task status
  const isCompleted = status === "completed";
  const isSnoozed = status === "snoozed";
  const isOverdue = status !== 'completed' && 
                    status !== 'snoozed' && 
                    status !== 'archived' &&
                    isPast(dueDate) && 
                    dueDate.getTime() < new Date().getTime();

  return (
    <Card className={`overflow-hidden border-l-4 ${
      status === 'archived' ? 'border-l-gray-400' :
      isOverdue ? 'border-l-red-500' : 
      priority === 'urgent' ? 'border-l-red-500' : 
      priority === 'high' ? 'border-l-orange-500' : 
      priority === 'medium' ? 'border-l-amber-500' : 
      'border-l-green-500'
    } ${isCompleted ? 'bg-green-50/30 dark:bg-green-950/10' : ''}`}>
      <div className="p-4 pb-2 flex items-start justify-between">
        <TaskCardHeader 
          title={title}
          priority={priority}
          isRecurring={isRecurring}
          isCompleted={isCompleted}
        />
        
        <TaskCardMenu 
          id={id}
          status={status}
          isArchived={isArchived}
          onDelete={onDelete}
          onEdit={onEdit}
          onCancel={onCancel}
          onSnooze={onSnooze}
          onRestore={onRestore}
          onStatusChange={onStatusChange}
          userRole={userRole}
          isPaidAccount={isPaidAccount}
        />
      </div>
      
      <CardContent className="p-4 pt-2">
        {description && (
          <p className={`text-sm mb-3 ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
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
        
        {subtasks && subtasks.length > 0 && (
          <TaskSubtasks 
            taskId={id}
            subtasks={subtasks}
            onSubtaskToggle={onSubtaskToggle}
            refetch={refetch}
          />
        )}
      </CardContent>
      
      {!isArchived && (
        <TaskCardFooter 
          id={id}
          status={status}
          completedDate={completedDate}
          dueDate={dueDate}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
        />
      )}
    </Card>
  );
};

export default TaskCard;
