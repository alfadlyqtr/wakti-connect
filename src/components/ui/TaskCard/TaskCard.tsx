
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskPriority, TaskStatus, TaskTab, SubTask } from "@/types/task.types";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskDueDate } from "./TaskDueDate";
import { TaskSubtasks } from "./TaskSubtasks";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskClaimButton } from "./TaskClaimButton";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isAssigned: boolean;
  isShared: boolean;
  subtasks: SubTask[];
  completedDate: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  delegatedEmail?: string | null;
  assigneeId?: string | null;
  refetch: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare: (id: string) => void;
  onAssign: (id: string) => void;
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
  isAssigned,
  isShared,
  subtasks,
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount,
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
  const isBusinessOrStaff = userRole === 'business' || userRole === 'staff';
  
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
          isShared={isShared}
          delegatedEmail={delegatedEmail}
        />
        
        <TaskCardMenu 
          id={id}
          status={status}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          onShare={onShare}
          onSnooze={onSnooze}
          onAssign={onAssign}
          userRole={userRole}
          isAssigned={isAssigned}
          isBusinessOrStaff={isBusinessOrStaff}
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
        
        {/* Staff can claim unassigned team tasks */}
        {userRole === 'staff' && !assigneeId && (
          <TaskClaimButton 
            taskId={id} 
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
