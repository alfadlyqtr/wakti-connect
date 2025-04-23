
import React from "react";
import { Task } from "@/types/task.types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TaskCard from "../ui/task-card/TaskCard";

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isLoading?: boolean;
  pendingTaskId?: string | null;
  userRole: "free" | "individual" | "business" | "staff" | null;
  refetch: () => Promise<void>;
  isArchiveView?: boolean;
}

export function TaskGrid({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onRestore,
  isLoading,
  pendingTaskId,
  userRole,
  refetch,
  isArchiveView = false,
}: TaskGridProps) {
  const handleStatusChange = (id: string, status: string) => {
    if (status === "completed" && onComplete) {
      onComplete(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task.id} className="relative">
          {isLoading && pendingTaskId === task.id && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description || ""}
            dueDate={task.due_date ? new Date(task.due_date) : new Date()}
            dueTime={task.due_time}
            status={task.status}
            priority={task.priority}
            userRole={userRole}
            subtasks={task.subtasks || []}
            isArchived={!!task.archived_at}
            completedDate={task.completed_at ? new Date(task.completed_at) : undefined}
            isRecurring={task.is_recurring}
            isRecurringInstance={task.is_recurring_instance}
            snoozeCount={task.snooze_count}
            snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : undefined}
            refetch={refetch}
            onEdit={() => onEdit(task)}
            onDelete={onDelete ? (id) => onDelete(id) : undefined}
            onStatusChange={handleStatusChange}
            onRestore={onRestore ? (id) => onRestore(id) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
