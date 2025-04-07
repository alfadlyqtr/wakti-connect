
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        title: t("task.createTask"),
        description: t("common.success"),
        variant: "success"
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("common.error"),
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
            <DialogTitle>{t("task.createTask")}</DialogTitle>
            <DialogDescription>
              {t("task.createTaskDescription")}
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
                    <FormLabel>{t("task.taskTitle")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("task.enterTaskTitle")}
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
                    <FormLabel>{t("task.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("task.enterTaskDescription")}
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
                      <FormLabel>{t("task.priority")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("task.selectPriority")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="urgent">{t("task.priority.urgent")}</SelectItem>
                          <SelectItem value="high">{t("task.priority.high")}</SelectItem>
                          <SelectItem value="medium">{t("task.priority.medium")}</SelectItem>
                          <SelectItem value="normal">{t("task.priority.normal")}</SelectItem>
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
                      <FormLabel>{t("task.dueDate")}</FormLabel>
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
                                <span>{t("task.pickDate")}</span>
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
                      <FormLabel>{t("task.dueTime")}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder={t("task.selectTime")}
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
                <Label htmlFor="enable-subtasks">{t("task.addSubtasks")}</Label>
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
                          <FormLabel>{t("task.enableSubtasks")}</FormLabel>
                          <FormDescription>
                            {t("task.subtasksDescription")}
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
                                      placeholder={t("task.subtaskContent")}
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
                        {t("task.addSubtask")}
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
                <Label htmlFor="enable-recurring">{t("task.makingRecurring")}</Label>
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
                          <FormLabel>{t("task.enableRecurring")}</FormLabel>
                          <FormDescription>
                            {t("task.recurringDescription")}
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
                            <FormLabel>{t("recurring.frequency")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("task.selectFrequency")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">{t("recurring.daily")}</SelectItem>
                                <SelectItem value="weekly">{t("recurring.weekly")}</SelectItem>
                                <SelectItem value="monthly">{t("recurring.monthly")}</SelectItem>
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
                            <FormLabel>{t("recurring.interval")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder={t("task.enterInterval")}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              {t("task.intervalDescription")}
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
                  {t("common.cancel")}
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !isFormValid()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("task.creating")}
                    </>
                  ) : (
                    t("task.createTask")
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
            <AlertDialogTitle>{t("task.freeAccountLimit")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("task.freeAccountMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFreeAccount}>
              {t("task.createTask")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
