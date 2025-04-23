
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { isPast } from "date-fns";
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskDueDate } from "../task-card/TaskDueDate";
import { TaskSubtasks } from "../task-card/TaskSubtasks";

// Palette for dynamic colors
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
  isArchived?: boolean;
  subtasks?: SubTask[] | any[];
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
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const isCompleted = status === "completed";
  const isOverdue = status !== 'completed' &&
    status !== 'snoozed' &&
    status !== 'archived' &&
    isPast(dueDate) &&
    dueDate.getTime() < new Date().getTime() &&
    (dueTime ? true : new Date().getHours() >= 23);

  // Card coloring and shadow logic
  let cardColor =
    isArchived
      ? PRIORITY_COLORS["archived"]
      : isOverdue
        ? "border-l-red-500 bg-red-50/70 dark:bg-[#2a1515]"
        : PRIORITY_COLORS[priority];

  if (isCompleted) {
    cardColor += " border-l-green-600"; // Extra green bar for completed
  }

  // Enhanced style for dashboard look
  const cardClassNames = [
    "overflow-hidden",
    "rounded-xl",
    "border",
    "shadow-md",
    "hover:shadow-lg",
    "transition-all",
    "duration-300",
    "group",
    "p-0",
    cardColor,
    isCompleted ? "opacity-80" : "",
    "relative",
    "cursor-pointer"
  ].join(" ");

  return (
    <Card className={cardClassNames}>
      {/* Card content padding/spacing */}
      <div className="flex flex-row justify-between items-start px-5 pt-4 pb-2">
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
      <CardContent className="px-5 pb-4 pt-0">
        {description && (
          <p className={`text-sm mb-3 ${
            isCompleted ? "text-muted-foreground line-through" : "text-muted-foreground"
          }`}>
            {description}
          </p>
        )}

        <div className="mb-2">
          <TaskDueDate
            dueDate={dueDate}
            dueTime={dueTime}
            status={status}
            snoozedUntil={snoozedUntil}
            snoozeCount={snoozeCount}
          />
        </div>

        {subtasks && subtasks.length > 0 && (
          <TaskSubtasks
            taskId={id}
            subtasks={subtasks}
            onSubtaskToggle={onSubtaskToggle}
            refetch={refetch}
          />
        )}
      </CardContent>
      {/* Use new dashboard look for the footer */}
      {!isArchived && (
        <div className="px-5 pb-4">
          <TaskCardFooter
            id={id}
            status={status}
            completedDate={completedDate}
            dueDate={dueDate}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        </div>
      )}
      {/* Hover visual border for summary-card effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-2 group-hover:ring-wakti-blue group-hover:opacity-70 transition-all duration-200" />
    </Card>
  );
};

export default TaskCard;
