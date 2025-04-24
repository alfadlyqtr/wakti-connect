import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask, Task } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskDueDate } from "./TaskDueDate";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { TaskCardCompletionAnimation } from "./TaskCardCompletionAnimation";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "border-l-wakti-gold bg-wakti-gold/10 hover:bg-wakti-gold/20 dark:bg-[#282113]",
  high: "border-l-wakti-navy bg-wakti-navy/5 hover:bg-wakti-navy/10 dark:bg-[#25210f]",
  medium: "border-l-wakti-blue bg-wakti-blue/5 hover:bg-wakti-blue/10 dark:bg-[#18281b]",
  normal: "border-l-green-500 bg-green-50/60 hover:bg-green-100/80 dark:bg-[#212229]",
  archived: "border-l-gray-300 bg-[#f6f6f7] hover:bg-gray-100 dark:bg-[#212229]",
};

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  subtasks?: SubTask[] | any[];
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
  onRestore?: (id: string) => void;
  isArchived?: boolean;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => Promise<void> | void;
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
  onRestore,
  isArchived = false,
  onSubtaskToggle
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const isCompleted = status === "completed";
  const isOverdue = !isCompleted && 
    status !== "snoozed" &&
    !isArchived &&
    isPast(dueDate) &&
    (dueTime ? true : new Date().getHours() >= 23);

  const priorityClass = isArchived ? PRIORITY_COLORS['archived'] : (PRIORITY_COLORS[priority] || PRIORITY_COLORS.normal);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.task-action-button')) {
      setDetailOpen(true);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    if (newStatus === "completed" && !isCompleted) {
      setShowCompletion(true);
    }
    await onStatusChange(taskId, newStatus);
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(id);
        if (refetch) refetch();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    if (onSubtaskToggle) {
      await onSubtaskToggle(id, subtaskIndex, isCompleted);
    }
  };

  return (
    <>
      <Card 
        className={`group overflow-hidden border-l-4 hover:shadow-lg dark:hover:shadow-gray-800/30 transition-all duration-300
          ${priorityClass} 
          ${isOverdue ? 'ring-1 ring-red-400 dark:ring-red-500/50' : ''}
          ${isCompleted ? 'opacity-75 hover:opacity-90' : ''}
          cursor-pointer
          hover:-translate-y-1
          hover:border-wakti-blue/20
          hover:shadow-[0_8px_16px_-6px_rgba(0,83,195,0.1)]
          dark:hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)]
        `}
        onClick={handleCardClick}
      >
        <div className="p-3 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <TaskCardHeader 
              title={title}
              priority={priority}
              isCompleted={isCompleted}
              isArchived={isArchived}
              isRecurring={isRecurring}
            />
            <div className="flex items-start" onClick={(e) => e.stopPropagation()}>
              <TaskCardMenu
                id={id}
                status={status}
                isArchived={isArchived}
                onDelete={handleDelete}
                onEdit={() => onEdit(id)}
                onStatusChange={handleStatusChange}
                onSnooze={onSnooze}
                onRestore={onRestore}
                userRole={userRole}
                isPaidAccount={isPaidAccount}
              />
            </div>
          </div>
          
          <CardContent className="px-0 py-2 flex-grow">
            {description && (
              <p className={`text-sm text-muted-foreground line-clamp-2 mb-3 group-hover:text-muted-foreground/80 transition-colors
                ${isCompleted ? 'text-muted-foreground/70' : ''}`}
              >
                {description}
              </p>
            )}

            <TaskDueDate
              dueDate={dueDate}
              dueTime={dueTime}
              status={status}
              isOverdue={isOverdue}
              snoozedUntil={snoozedUntil}
              snoozeCount={snoozeCount}
              isCompleted={isCompleted}
              completedDate={completedDate}
            />
          </CardContent>
          
          <TaskCardFooter 
            isCompleted={isCompleted}
            subtaskCount={subtasks?.length || 0}
            completedSubtaskCount={subtasks?.filter(st => st.is_completed)?.length || 0}
            id={id}
            status={status}
            completedDate={completedDate}
            onStatusChange={handleStatusChange}
          />
        </div>
      </Card>

      <TaskDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        task={{
          id,
          title,
          description,
          due_date: dueDate.toISOString(),
          due_time: dueTime,
          status,
          priority,
          subtasks,
          completed_at: completedDate?.toISOString(),
          is_recurring: isRecurring,
          is_recurring_instance: isRecurringInstance,
          snooze_count: snoozeCount,
          snoozed_until: snoozedUntil?.toISOString(),
          user_id: '', // Required by Task type
          created_at: new Date().toISOString() // Required by Task type
        }}
        onEdit={() => {
          setDetailOpen(false);
          onEdit(id);
        }}
        onDelete={() => {
          setDetailOpen(false);
          handleDelete();
        }}
        onStatusChange={handleStatusChange}
        onSubtaskToggle={handleSubtaskToggle}
        refetch={refetch}
      />

      <TaskCardCompletionAnimation
        show={showCompletion}
        isAheadOfTime={dueDate > new Date()}
        onAnimationComplete={() => setShowCompletion(false)}
      />
    </>
  );
};

export default TaskCard;
