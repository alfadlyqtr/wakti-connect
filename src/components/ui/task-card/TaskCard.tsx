import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask, Task } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskDueDate } from "../task-card/TaskDueDate";
import { TaskDetailDialog } from "./TaskDetailDialog";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "border-l-red-500 bg-red-50/70 dark:bg-[#2a1515]",
  high: "border-l-orange-400 bg-orange-50/70 dark:bg-[#282113]",
  medium: "border-l-amber-400 bg-yellow-50/70 dark:bg-[#25210f]",
  normal: "border-l-green-500 bg-green-50/60 dark:bg-[#18281b]",
  archived: "border-l-gray-300 bg-[#f6f6f7] dark:bg-[#212229]",
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
        className={`overflow-hidden border-l-4 hover:shadow-md transition-all 
          ${priorityClass} 
          ${isOverdue ? 'ring-1 ring-red-400' : ''}
          ${isCompleted || isArchived ? 'opacity-75' : ''}
          cursor-pointer
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
                onDelete={onDelete}
                onEdit={() => onEdit(id)}
                onStatusChange={onStatusChange}
                onSnooze={onSnooze}
                onRestore={onRestore}
                userRole={userRole}
                isPaidAccount={isPaidAccount}
              />
            </div>
          </div>
          
          <CardContent className="px-0 py-2 flex-grow">
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
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
        onStatusChange={onStatusChange}
        onSubtaskToggle={handleSubtaskToggle}
        refetch={refetch}
      />
    </>
  );
};

export default TaskCard;
