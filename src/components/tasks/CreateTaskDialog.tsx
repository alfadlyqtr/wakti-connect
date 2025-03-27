
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
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
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  const handleAddSubtask = () => {
    append({ content: "", isCompleted: false });
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
        is_recurring: values.isRecurring
      };

      console.log("Form values:", values);
      console.log("Creating task with data:", taskData);

      if (values.enableSubtasks && values.subtasks && values.subtasks.length > 0) {
        taskData.subtasks = values.subtasks.map((subtask) => ({
          content: subtask.content,
          is_completed: subtask.isCompleted || false,
          due_date: subtask.dueDate || null,
          due_time: subtask.dueTime || null,
        }));
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
        title: "Task created",
        description: "Your task has been successfully created",
        variant: "success"
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Task creation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new personal task.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateTask)}
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
                            <SelectValue placeholder="Select priority" />
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
                      <FormLabel>Due Time (optional)</FormLabel>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-subtasks"
                  checked={showSubtasks}
                  onCheckedChange={setShowSubtasks}
                />
                <Label htmlFor="enable-subtasks">Add Subtasks</Label>
              </div>

              {showSubtasks && (
                <div className="border rounded-md p-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="enableSubtasks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Subtasks</FormLabel>
                          <FormDescription>
                            Create a list of subtasks for this task
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("enableSubtasks") && (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`subtasks.${index}.content`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Subtask content"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSubtask}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Subtask
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-recurring"
                  checked={showRecurring}
                  onCheckedChange={setShowRecurring}
                />
                <Label htmlFor="enable-recurring">Make Recurring Task</Label>
              </div>

              {showRecurring && (
                <div className="border rounded-md p-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Recurring</FormLabel>
                          <FormDescription>
                            Make this task repeat based on a schedule
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("isRecurring") && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="recurring.frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recurring.interval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interval</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="Enter interval"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Every how many days/weeks/months the task should
                              repeat
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
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
                  disabled={loading || !isFormValid()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <AlertDialogTitle>Free Account Limitation</AlertDialogTitle>
            <AlertDialogDescription>
              Free accounts can only create one task per month. This task will
              count towards your monthly limit.
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
