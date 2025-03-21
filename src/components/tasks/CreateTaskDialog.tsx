
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
import { taskFormSchema } from "@/lib/validations/task";
import { TaskFormTabs } from "./TaskFormTabs";
import { format } from "date-fns";

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
      due_date: format(new Date(), "yyyy-MM-dd"),
      status: "pending",
      category: "daily",
      recurring: {
        frequency: "daily",
        interval: 1,
        days_of_week: "1",
        day_of_month: 1,
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

  // Update isPaidAccount to consider 'staff' as a paid account as well
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";

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
