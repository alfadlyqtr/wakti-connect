
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskFormTabs } from "./TaskFormTabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "./TaskFormSchema";
import { DialogHeader } from "../ui/dialog";
import { X } from "lucide-react";
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
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dueTime: "",
      isRecurring: false,
      enableSubtasks: false,
      subtasks: [],
      subtaskGroupTitle: "", // Add default for subtaskGroupTitle
    }
  });
  
  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Process data as needed
      
      // Handle the subtaskGroupTitle and subtasks formatting
      if (data.enableSubtasks && data.subtaskGroupTitle) {
        // Process subtasks with group title if needed
        console.log("Task with subtasks group:", data.subtaskGroupTitle);
      }
      
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
          <DialogTitle className="flex justify-between items-center">
            <span>Create New Task</span>
            <X 
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" 
              onClick={() => onOpenChange(false)}
            />
          </DialogTitle>
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
