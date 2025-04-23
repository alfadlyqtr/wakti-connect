
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormValues } from "./TaskFormSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SubtasksSection } from "./form-fields/SubtasksSection";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/types/task.types";
import { EditTaskFields } from "./edit-dialog/EditTaskFields";
import { EditTaskDateTimeFields } from "./edit-dialog/EditTaskDateTimeFields";
import { EditTaskSubtasksToggle } from "./edit-dialog/EditTaskSubtasksToggle";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdateTask: (taskId: string, taskData: any) => Promise<void>;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  onUpdateTask,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: format(new Date(), "yyyy-MM-dd"),
      due_time: "",
      enableSubtasks: false,
      subtasks: []
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        due_time: task.due_time || "",
        enableSubtasks: task.subtasks && task.subtasks.length > 0,
        subtasks: task.subtasks || []
      });
    }
  }, [task, form]);

  const handleUpdateTask = async (values: TaskFormValues) => {
    if (!task) return;
    setLoading(true);

    try {
      const taskData = {
        title: values.title,
        description: values.description || "",
        priority: values.priority,
        status: task.status,
        due_date: values.due_date,
        due_time: values.due_time || null,
        subtasks: values.enableSubtasks ? values.subtasks : []
      };

      await onUpdateTask(task.id, taskData);
      
      onOpenChange(false);
      
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating the task.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and properties.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateTask)} className="space-y-6">
            <EditTaskFields form={form} />
            <EditTaskDateTimeFields form={form} />
            <EditTaskSubtasksToggle form={form} />
            
            {form.watch("enableSubtasks") && (
              <SubtasksSection form={form} />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
