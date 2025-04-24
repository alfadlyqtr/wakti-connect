import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask, Task } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskDueDate } from "./TaskDueDate";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "border-l-wakti-gold bg-gradient-to-br from-wakti-gold/10 via-white/95 to-wakti-gold/5 hover:from-wakti-gold/15 hover:to-wakti-gold/10 dark:from-[#282113] dark:to-[#1a1608]",
  high: "border-l-wakti-navy bg-gradient-to-br from-wakti-navy/10 via-white/95 to-wakti-navy/5 hover:from-wakti-navy/15 hover:to-wakti-navy/10 dark:from-[#25210f] dark:to-[#1a1608]",
  medium: "border-l-wakti-blue bg-gradient-to-br from-wakti-blue/10 via-white/95 to-wakti-blue/5 hover:from-wakti-blue/15 hover:to-wakti-blue/10 dark:from-[#18281b] dark:to-[#121b13]",
  normal: "border-l-green-500 bg-gradient-to-br from-green-100/80 via-white/95 to-green-50/60 hover:from-green-100 hover:to-green-50/80 dark:from-[#212229] dark:to-[#1a1b21]",
  archived: "border-l-gray-300 bg-gradient-to-br from-gray-100/80 via-white/95 to-gray-50/60 hover:from-gray-100 hover:to-gray-50/80 dark:from-[#212229] dark:to-[#1a1b21]",
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
        className={cn(
          "group relative overflow-hidden border-l-4 transition-all duration-300",
          "hover:shadow-xl dark:hover:shadow-black/30",
          "hover:-translate-y-1",
          "hover:ring-2 hover:ring-primary/20",
          priorityClass,
          isOverdue ? 'ring-2 ring-red-400 dark:ring-red-500/50' : '',
          isCompleted ? 'opacity-85 hover:opacity-95' : ''
        )}
        onClick={handleCardClick}
      >
        {isCompleted && (
          <div className="absolute -right-8 top-6 rotate-45 transform">
            <Stamp 
              className="h-24 w-24 text-primary/30 dark:text-primary/20" 
              strokeWidth={1}
            />
          </div>
        )}
        
        <div className="p-4 flex flex-col h-full relative z-10">
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
              <p className={cn(
                "text-sm text-muted-foreground line-clamp-2 mb-3",
                "group-hover:text-muted-foreground/80 transition-colors",
                isCompleted ? 'text-muted-foreground/70' : ''
              )}>
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
    </>
  );
};

export default TaskCard;
