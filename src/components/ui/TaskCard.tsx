
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCard/TaskCardHeader";
import { TaskCardMenu } from "./TaskCard/TaskCardMenu";
import { TaskCardFooter } from "./TaskCard/TaskCardFooter";
import { TaskDueDate } from "./task-card/TaskDueDate";
import { TaskSubtasks } from "./task-card/TaskSubtasks";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  subtasks?: SubTask[];
  completedDate?: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  refetch?: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
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
  subtasks = [],
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount = 0,
  snoozedUntil,
  refetch,
  onEdit,
  onDelete,
  onStatusChange,
  onSnooze,
  onSubtaskToggle
}) => {
  const isOverdue = status !== 'completed' && 
                    status !== 'snoozed' && 
                    isPast(dueDate) && 
                    dueDate.getTime() < new Date().getTime();

  return (
    <Card className={`border-l-4 ${isOverdue ? 'border-l-red-500' : `border-l-${priority === 'urgent' ? 'red-600' : priority === 'high' ? 'red-500' : priority === 'medium' ? 'amber-500' : 'green-500'}`}`}>
      <TaskCardHeader
        title={title}
        priority={priority}
        isRecurring={isRecurring}
        isCompleted={status === 'completed'}
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
