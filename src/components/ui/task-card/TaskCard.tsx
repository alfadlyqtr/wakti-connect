
import React from "react";
import { Card } from "@/components/ui/card";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | string;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  subtasks?: SubTask[];
  completedDate?: Date | string | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | string | null;
  refetch?: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = (props) => {
  return (
    <Card className="overflow-hidden">
      {/* Task card implementation will be added by the component system */}
    </Card>
  );
};

export default TaskCard;
