
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { TaskFormValues } from "./TaskFormSchema";
import { Task, TaskFormData } from "@/types/task.types";

export interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: "free" | "individual" | "business" | "staff";
  onCreateTask?: (taskData: TaskFormData) => Promise<Task>;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onOpenChange,
  userRole,
  onCreateTask
}) => {
  const handleSubmit = async (values: TaskFormValues) => {
    try {
      if (onCreateTask) {
        // Convert form values to the TaskFormData format
        const taskData: TaskFormData = {
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          due_date: values.due_date,
          due_time: values.due_time || null,
          subtasks: values.subtasks.map(subtask => ({
            content: subtask.content,
            is_completed: subtask.is_completed || false,
            due_date: subtask.due_date || null,
            due_time: subtask.due_time || null
          }))
        };
        
        // Add recurring data if enabled
        if (values.isRecurring && values.recurring) {
          taskData.isRecurring = true;
          taskData.recurring = values.recurring;
        }
        
        // Call the onCreateTask callback
        await onCreateTask(taskData);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm 
          onSubmit={handleSubmit}
          isPaidAccount={userRole !== "free"}
          isCreate={true}
        />
      </DialogContent>
    </Dialog>
  );
};
