
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormValues } from "@/components/tasks/TaskFormSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SubtasksSection } from "./form-fields/SubtasksSection";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/types/task.types";

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
      console.log("Setting form values for task:", task);
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
      console.log("Form values before sending to API:", values);
      
      const taskData = {
        title: values.title,
        description: values.description || "",
        priority: values.priority,
        status: task.status,
        due_date: values.due_date,
        due_time: values.due_time || null,
        subtasks: values.enableSubtasks ? values.subtasks : []
      };

      console.log("Updating task with data:", taskData);
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
          <form
            onSubmit={form.handleSubmit(handleUpdateTask)}
            className="space-y-6"
          >
            {/* Basic Task Fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Due Date and Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <input
                        type="time"
                        className="w-full h-9 border rounded px-3 py-1 text-sm"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subtasks Toggle */}
            <FormField
              control={form.control}
              name="enableSubtasks"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Subtasks</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Add and manage subtasks for this task
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Subtasks Section */}
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
              <Button 
                type="submit" 
                disabled={loading}
              >
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
