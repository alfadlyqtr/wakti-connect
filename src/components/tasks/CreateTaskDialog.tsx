import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TaskFormValues, taskFormSchema } from "./TaskFormSchema";
import TaskFormFields from "./TaskFormFields";
import RecurringFormFields from "@/components/recurring/RecurringFormFields";
import { toast } from "@/components/ui/use-toast";
import { TaskFormData, SubTask } from "@/types/task.types";
import { RecurringFormData } from "@/types/recurring.types";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: TaskFormData, recurringData?: RecurringFormData) => Promise<any>;
  userRole: "free" | "individual" | "business";
}

export function CreateTaskDialog({ 
  open, 
  onOpenChange, 
  onCreateTask,
  userRole
}: CreateTaskDialogProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: new Date(Date.now() + 86400000), // Tomorrow
      due_time: "",
      subtasks: [],
      isRecurring: false,
      recurring: {
        frequency: "daily",
        interval: 1,
        days_of_week: [],
      }
    }
  });
  
  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the datetime by combining date and time
      let dueDateTime = new Date(values.due_date);
      
      if (values.due_time) {
        const [hours, minutes] = values.due_time.split(':').map(Number);
        dueDateTime.setHours(hours, minutes);
      }
      
      // Ensure subtasks all have content property set (not optional)
      const validSubtasks: SubTask[] = values.subtasks
        .filter(item => item.content && item.content.trim() !== '')
        .map(item => ({
          content: item.content,
          is_completed: item.is_completed || false
        }));
      
      const taskData: TaskFormData = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        due_date: dueDateTime.toISOString(),
        status: "pending",
        subtasks: validSubtasks
      };
      
      const recurringData = values.isRecurring ? values.recurring as RecurringFormData : undefined;
      
      await onCreateTask(taskData, recurringData);
      
      onOpenChange(false);
      form.reset();
      setIsRecurring(false);
    } catch (error: any) {
      if (error.message === "This feature is only available for paid accounts") {
        toast({
          title: "Premium Feature",
          description: "Recurring tasks are only available for paid accounts. Please upgrade your plan.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error creating task",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TaskFormFields form={form} />
            
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="recurring-task"
                checked={isRecurring}
                onCheckedChange={(checked) => {
                  setIsRecurring(checked);
                  form.setValue("isRecurring", checked);
                }}
                disabled={!isPaidAccount}
              />
              <Label htmlFor="recurring-task">
                Make this a recurring task {!isPaidAccount && "(Premium)"}
              </Label>
            </div>
            
            {isRecurring && <RecurringFormFields form={form} userRole={userRole} />}
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
