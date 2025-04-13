
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
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import TaskFormFields from "./form-fields/TaskFormFields";

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
  userRole,
}) => {
  const [loading, setLoading] = useState(false);
  const [freeAccountAlertOpen, setFreeAccountAlertOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dueTime: "",
      enableSubtasks: false,
      subtasks: [],
      isRecurring: false,
      recurring: {
        frequency: "weekly",
        interval: 1,
      },
      preserveNestedStructure: true
    },
  });

  // Function to process nested subtasks before submission
  const processNestedSubtasks = (subtasks: any[]) => {
    return subtasks.map(subtask => {
      // Create a clean subtask object
      const cleanSubtask: any = {
        content: subtask.content,
        is_completed: subtask.isCompleted || false,
        due_date: subtask.dueDate || null,
        due_time: subtask.dueTime || null,
      };
      
      // Add group-specific properties if this is a group
      if (subtask.is_group) {
        cleanSubtask.is_group = true;
        cleanSubtask.title = subtask.title || subtask.content;
        
        // Process nested subtasks if they exist
        if (subtask.subtasks && subtask.subtasks.length > 0) {
          cleanSubtask.subtasks = subtask.subtasks.map((nestedSubtask: any) => ({
            content: nestedSubtask.content,
            is_completed: nestedSubtask.isCompleted || false,
            due_date: nestedSubtask.dueDate || null,
            due_time: nestedSubtask.dueTime || null,
            parent_id: 'pending' // Will be replaced with actual parent ID after creation
          }));
        }
      }
      
      return cleanSubtask;
    });
  };

  const handleCreateTask = async (values: TaskFormValues) => {
    if (userRole === "free") {
      setFreeAccountAlertOpen(true);
      return;
    }
    
    setLoading(true);

    try {
      const taskData: any = {
        title: values.title,
        description: values.description || "",
        priority: values.priority,
        due_date: values.dueDate,
        due_time: values.dueTime || null,
        is_recurring: values.isRecurring,
        preserve_nested_structure: values.preserveNestedStructure
      };

      console.log("Form values:", values);

      if (values.enableSubtasks && values.subtasks && values.subtasks.length > 0) {
        // Process subtasks to handle nested structure
        taskData.subtasks = processNestedSubtasks(values.subtasks);
      } else {
        taskData.subtasks = [];
      }

      if (values.isRecurring && values.recurring) {
        taskData.recurring = {
          frequency: values.recurring.frequency,
          interval: values.recurring.interval,
          days_of_week: values.recurring.daysOfWeek,
          day_of_month: values.recurring.dayOfMonth,
          end_date: values.recurring.endDate,
          max_occurrences: values.recurring.maxOccurrences,
        };
      }

      console.log("Submitting task data:", taskData);
      await onCreateTask(taskData);
      
      form.reset();
      onOpenChange(false);
      
      toast({
        title: "Create Task",
        description: "Success",
        variant: "success"
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmFreeAccount = () => {
    setFreeAccountAlertOpen(false);
    handleCreateTask(form.getValues());
  };
  
  const isFormValid = () => {
    const values = form.getValues();
    return !!values.title && !!values.dueDate;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Create a new task with details and optional subtasks.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateTask)}
              className="space-y-6"
            >
              <TaskFormFields form={form} />

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
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
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

      <AlertDialog
        open={freeAccountAlertOpen}
        onOpenChange={setFreeAccountAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Free Account Limit</AlertDialogTitle>
            <AlertDialogDescription>
              Free accounts are limited to one task. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFreeAccount}>
              Create Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
