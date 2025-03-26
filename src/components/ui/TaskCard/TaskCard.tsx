
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskDueDate } from "./TaskDueDate";
import { TaskSubtasks } from "./TaskSubtasks";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskCardMenu } from "./TaskCardMenu";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  subtasks: SubTask[];
  completedDate: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  refetch: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onSnooze: (id: string, days: number) => void;
  onSubtaskToggle: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
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
  subtasks,
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount,
  snoozedUntil,
  refetch,
  onEdit,
  onDelete,
  onStatusChange,
  onSnooze,
  onSubtaskToggle
}) => {
  const isPaidAccount = userRole === 'business' || userRole === 'individual';
  
  // Show or hide certain features based on the task status
  const isCompleted = status === 'completed';
  const isSnoozed = status === 'snoozed';
  
  return (
    <Card className={`overflow-hidden ${
      priority === 'urgent' ? 'border-l-4 border-l-red-500' : 
      priority === 'high' ? 'border-l-4 border-l-orange-500' : 
      priority === 'medium' ? 'border-l-4 border-l-amber-500' : ''
    }`}>
      <CardHeader className="p-4 pb-2">
        <TaskCardHeader 
          title={title}
          priority={priority}
          isRecurring={isRecurring}
          isCompleted={isCompleted}
        />
        
        <TaskCardMenu 
          id={id}
          status={status}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          onSnooze={onSnooze}
          userRole={userRole}
          isPaidAccount={isPaidAccount}
        />
      </CardHeader>
      
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
