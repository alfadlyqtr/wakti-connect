
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
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/types/task.types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

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
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dueTime: "",
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        dueTime: task.due_time || "",
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
        due_date: values.dueDate,
        due_time: values.dueTime || null,
      };

      console.log("Updating task with data:", taskData);
      await onUpdateTask(task.id, taskData);
      
      onOpenChange(false);
      
      toast({
        title: "Update Task",
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

  // Helper function to get priority label - hardcoded to English
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "medium": return "Medium";
      case "normal": return "Normal";
      default: return "Select Priority";
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return !!values.title && !!values.dueDate;
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
                          <SelectValue>
                            {field.value ? getPriorityLabel(field.value) : "Select Priority"}
                          </SelectValue>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? new Date(field.value)
                              : new Date()
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date
                                ? format(date, "yyyy-MM-dd")
                                : format(new Date(), "yyyy-MM-dd")
                            )
                          }
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="Select time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                disabled={loading || !isFormValid()}
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
