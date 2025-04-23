
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { TaskFormValues } from "./TaskFormSchema";
import { useTaskOperations } from "@/hooks/tasks/useTaskOperations";
import { toast } from "@/components/ui/use-toast";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: "free" | "individual" | "business" | "staff";
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  userRole
}: CreateTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTask } = useTaskOperations(userRole);

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      await createTask(data);
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "success"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <TaskForm 
          onSubmit={handleCreateTask} 
          isSubmitting={isSubmitting} 
          submitLabel="Create Task"
        />
      </DialogContent>
    </Dialog>
  );
}
