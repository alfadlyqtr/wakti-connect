
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SubTask } from "@/types/task.types";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, ListTodo } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskSubtasksProps {
  taskId: string;
  subtasks: SubTask[];
  onSubtaskToggle: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
  refetch: () => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  taskId,
  subtasks,
  onSubtaskToggle,
  refetch
}) => {
  const { t, i18n } = useTranslation();
  const completedCount = subtasks.filter(subtask => subtask.is_completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ListTodo className="h-3.5 w-3.5" />
          <span>{completedCount} {t("task.of")} {subtasks.length} {t("task.completed")}</span>
        </div>
        <span>{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-1.5" />
      
      <div className="space-y-1.5 mt-2">
        {subtasks.slice(0, 3).map((subtask, index) => (
          <div key={subtask.id || index} className="flex items-start gap-2">
            <Checkbox
              id={`subtask-${taskId}-${index}`}
              checked={subtask.is_completed}
              onCheckedChange={(checked) => {
                onSubtaskToggle(taskId, index, checked as boolean);
              }}
              className="mt-0.5"
            />
            <label
              htmlFor={`subtask-${taskId}-${index}`}
              className={`text-sm ${
                subtask.is_completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {subtask.content}
              {subtask.due_date && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({t("task.due")}: {new Date(subtask.due_date).toLocaleDateString()})
                </span>
              )}
            </label>
          </div>
        ))}
        
        {subtasks.length > 3 && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <CheckSquare className="h-3 w-3 mr-1" />
            <span>+{subtasks.length - 3} {t("task.subtasks")}</span>
          </div>
        )}
      </div>
    </div>
  );
};
