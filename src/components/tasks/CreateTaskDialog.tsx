
import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { PlusCircle, Trash2, CalendarIcon, HelpCircle, UsersIcon, Info } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  const [showTeamTask, setShowTeamTask] = useState(false);
  const [freeAccountAlertOpen, setFreeAccountAlertOpen] = useState(false);
  const [isClaimTask, setIsClaimTask] = useState(false);
  const [selectedTaskToClaim, setSelectedTaskToClaim] = useState<string | null>(null);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);

  useEffect(() => {
    const checkIfStaff = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const isStaff = localStorage.getItem('isStaff') === 'true';
      const currentTab = localStorage.getItem('currentTaskTab');
      
      if (isStaff && currentTab === 'team-tasks') {
        setIsClaimTask(true);
        
        const businessId = localStorage.getItem('staffBusinessId');
        if (businessId) {
          const { data, error } = await supabase
            .from('tasks')
            .select('id, title, description, due_date, priority')
            .eq('user_id', businessId)
            .eq('is_team_task', true)
            .is('assignee_id', null)
            .order('created_at', { ascending: false });
            
          if (!error && data) {
            setTeamTasks(data);
          }
        }
      }
    };
    
    if (open) {
      checkIfStaff();
    }
  }, [open]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
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
      delegated_email: "",
      is_team_task: false,
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
    if (isClaimTask && selectedTaskToClaim) {
      setLoading(true);
      try {
        await onCreateTask({ id: selectedTaskToClaim });
        form.reset();
      } catch (error) {
        console.error("Error claiming task:", error);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);

    try {
      const taskData: any = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        due_date: values.dueDate,
        due_time: values.dueTime || null,
        is_recurring: values.isRecurring,
        delegated_email: values.delegated_email || null,
        is_team_task: values.is_team_task || false,
        subtasks: values.enableSubtasks
          ? values.subtasks.map((subtask) => ({
              content: subtask.content,
              is_completed: subtask.isCompleted,
              due_date: subtask.dueDate || null,
              due_time: subtask.dueTime || null,
            }))
          : [],
      };

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

      await onCreateTask(taskData);
      form.reset();
      setShowSubtasks(false);
      setShowRecurring(false);
      setShowTeamTask(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmFreeAccount = () => {
    setFreeAccountAlertOpen(false);
    handleCreateTask(form.getValues());
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isClaimTask ? "Claim Team Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {isClaimTask 
                ? "Select a team task to claim and work on" 
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>

          {isClaimTask ? (
            <div className="space-y-4">
              {teamTasks.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No Tasks Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are currently no team tasks available to claim.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {teamTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTaskToClaim === task.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedTaskToClaim(task.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <Badge className={`${
                            task.priority === 'urgent' ? 'bg-red-500' :
                            task.priority === 'high' ? 'bg-orange-500' :
                            task.priority === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        {task.due_date && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <DialogFooter>
                    <Button
                      disabled={!selectedTaskToClaim || loading}
                      onClick={() => handleCreateTask(form.getValues())}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        "Claim Task"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          ) : (
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
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

                {userRole === "business" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="team-task"
                      checked={form.watch("is_team_task")}
                      onCheckedChange={(checked) => form.setValue("is_team_task", checked)}
                    />
                    <Label htmlFor="team-task">Make this a team task</Label>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="sr-only">Info</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Team tasks can be claimed and completed by any staff member
                      </TooltipContent>
                    </Tooltip>
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
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
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
