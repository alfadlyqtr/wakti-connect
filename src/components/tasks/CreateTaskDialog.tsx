
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormTabs } from "./TaskFormTabs";
import { taskFormSchema } from "./TaskFormSchema";
import { SubTask } from "@/types/task.types";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (data: any) => Promise<void>;
  userRole: "free" | "individual" | "business" | "staff";
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  userRole
}: CreateTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: new Date().toISOString().split('T')[0],
      subtasks: [] as SubTask[],
      recurring: {
        frequency: "daily",
        interval: 1,
        max_occurrences: 5
      }
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Format the task data
      const taskData = {
        ...data,
        is_recurring: isRecurring,
        recurring: isRecurring ? data.recurring : null
      };
      
      await onCreateTask(taskData);
      
      // Reset the form
      form.reset();
      setIsRecurring(false);
      
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when closing
        form.reset();
        setIsRecurring(false);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <TaskFormTabs
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          userRole={userRole}
          submitLabel="Create Task"
        />
      </DialogContent>
    </Dialog>
  );
}
