
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskFormTabs } from "./TaskFormTabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "./TaskFormSchema";
import { DialogHeader } from "../ui/dialog";
import { format } from "date-fns";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskData: any) => Promise<void>;
  userRole: "free" | "individual" | "business" | "staff";
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask,
  userRole
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Initialize the form with default values including empty subtasks array
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: format(new Date(), "yyyy-MM-dd"),
      due_time: "",
      isRecurring: false,
      enableSubtasks: false,
      subtasks: [],
      subtaskGroupTitle: "", // Add default for subtaskGroupTitle
    }
  });
  
  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Creating task with data:", data);
      
      // Add isRecurring from the state
      data.isRecurring = isRecurring;
      
      // Process data for API submission - no need to transform field names as they're already correct
      await onCreateTask(data);
      
      // Reset form and close dialog on success
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task with details and optional subtasks.
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
};
