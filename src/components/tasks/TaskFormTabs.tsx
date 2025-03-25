
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
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
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2, Plus, Trash2, Clock, Calendar } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { TaskFormFields } from "@/components/tasks";
import { TimePicker } from "@/components/ui/time-picker";

interface TaskFormTabsProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  userRole: "free" | "individual" | "business" | "staff";
  submitLabel: string;
}

export function TaskFormTabs({
  form,
  onSubmit,
  isSubmitting,
  isRecurring,
  setIsRecurring,
  userRole,
  submitLabel
}: TaskFormTabsProps) {
  // Check if the user has a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";
  
  // Setup field array for subtasks
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  // Watch enableSubtasks value to know if we should show subtasks tab
  const enableSubtasks = form.watch("enableSubtasks");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="subtasks" disabled={!enableSubtasks}>
              Subtasks
              {!enableSubtasks && <span className="ml-1 text-xs">(Disabled)</span>}
            </TabsTrigger>
            <TabsTrigger value="recurring" disabled={!isPaidAccount}>
              Recurring Options
              {!isPaidAccount && <span className="ml-1 text-xs">(Pro)</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
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
                      placeholder="Add task description..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due Time
                    </FormLabel>
                    <FormControl>
                      <TimePicker 
                        value={field.value || ""} 
                        onChange={field.onChange}
                        interval={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
              {isPaidAccount && (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="recurring-switch"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="recurring-switch"
                    className="cursor-pointer font-medium"
                  >
                    Make this a recurring task
                  </FormLabel>
                </FormItem>
              )}
              
              <FormField
                control={form.control}
                name="enableSubtasks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-medium">
                      Enable Subtasks
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="subtasks" className="space-y-4 pt-4">
            {enableSubtasks ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Manage Subtasks</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ content: "", is_completed: false, due_date: null, due_time: null })}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Subtask
                  </Button>
                </div>
                
                {fields.length === 0 && (
                  <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
                    No subtasks added yet. Click the button above to add one.
                  </div>
                )}
                
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-4 space-y-3">
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtask {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter subtask..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`subtasks.${index}.due_date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                value={field.value || ""}
                                max={form.watch("due_date")} // Can't exceed main task due date
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`subtasks.${index}.due_time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due Time
                            </FormLabel>
                            <FormControl>
                              <TimePicker 
                                value={field.value || ""} 
                                onChange={field.onChange}
                                interval={15}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove Subtask
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Enable subtasks on the Details tab first.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recurring" className="space-y-4 pt-4">
            {isPaidAccount ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Configure how this task should repeat.
                </div>
                
                <FormField
                  control={form.control}
                  name="recurring.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isRecurring}
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
                          <SelectItem value="yearly">Yearly</SelectItem>
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
                      <FormLabel>Repeat Every</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          disabled={!isRecurring}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recurring.max_occurrences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occurrences</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                          disabled={!isRecurring}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Recurring tasks are available on paid plans.
                </p>
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
