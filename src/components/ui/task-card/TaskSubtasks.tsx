
import React from "react";
import { SubTask } from "@/types/task.types";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TaskSubtasksProps {
  taskId: string;
  subtasks?: SubTask[];
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  taskId,
  subtasks = [],
  onSubtaskToggle,
  refetch
}) => {
  if (!subtasks || subtasks.length === 0) return null;

  const handleSubtaskToggle = async (index: number, subtaskId?: string) => {
    const subtask = subtasks[index];
    const newStatus = !subtask.is_completed;
    
    try {
      if (subtaskId) {
        // If we have a subtask ID, update it in the database
        const { error } = await supabase
          .from('todo_items')
          .update({ 
            is_completed: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', subtaskId);
          
        if (error) throw error;
      }
      
      // Call the parent component's handler
      if (onSubtaskToggle) {
        onSubtaskToggle(taskId, index, newStatus);
      }
      
      // Refresh the task data if needed
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
      toast({
        title: "Failed to update subtask",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium">Subtasks ({subtasks.filter(st => st.is_completed).length}/{subtasks.length})</h4>
      <ul className="space-y-1.5">
        {subtasks.map((subtask, index) => (
          <li key={subtask.id || index} className="flex items-start gap-2">
            <Checkbox 
              id={`subtask-${taskId}-${index}`}
              checked={subtask.is_completed}
              onCheckedChange={() => handleSubtaskToggle(index, subtask.id)}
              className="mt-0.5"
            />
            <label 
              htmlFor={`subtask-${taskId}-${index}`}
              className={`text-sm ${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {subtask.content}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
