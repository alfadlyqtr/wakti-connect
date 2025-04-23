
import React from "react";
import { SubTask } from "@/types/task.types";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskSubtasksProps {
  taskId: string;
  subtasks: SubTask[];
  onSubtaskToggle?: (subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  taskId,
  subtasks,
  onSubtaskToggle,
  refetch
}) => {
  const handleToggle = (index: number, checked: boolean) => {
    if (onSubtaskToggle) {
      onSubtaskToggle(index, checked);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Subtasks</h3>
      <div className="space-y-1.5">
        {subtasks.map((subtask, index) => (
          <div key={subtask.id || index} className="flex items-start space-x-2">
            <Checkbox 
              id={`subtask-${index}`}
              checked={subtask.is_completed}
              onCheckedChange={(checked) => handleToggle(index, Boolean(checked))}
              className="mt-0.5"
            />
            <label 
              htmlFor={`subtask-${index}`}
              className={`text-sm leading-tight ${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {subtask.content}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
