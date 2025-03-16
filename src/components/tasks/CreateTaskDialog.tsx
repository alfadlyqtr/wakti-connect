
import React from "react";
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
import { Task } from "@/types/task.types";
import { taskFormSchema, TaskFormValues } from "./TaskFormSchema";
import TaskFormFields from "./TaskFormFields";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<Task>) => Promise<any>;
  userRole: "free" | "individual" | "business";
}

export function CreateTaskDialog({ 
  open, 
  onOpenChange, 
  onCreateTask,
  userRole
}: CreateTaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: new Date(Date.now() + 86400000) // Tomorrow
    }
  });
  
  const handleSubmit = async (values: TaskFormValues) => {
    await onCreateTask({
      title: values.title,
      description: values.description,
      priority: values.priority,
      due_date: values.due_date.toISOString(),
      status: "pending"
    });
    
    onOpenChange(false);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TaskFormFields form={form} />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
