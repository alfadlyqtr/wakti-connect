
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
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Task Details</TabsTrigger>
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
            
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Subtasks Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Subtasks</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ content: "", is_completed: false })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Subtask
                </Button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-xs text-muted-foreground p-2 border border-dashed rounded-md text-center">
                  No subtasks added yet. Add a subtask to break down this task.
                </div>
              )}
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`subtasks.${index}.content`}
                    render={({ field }) => (
                      <FormItem className="flex-1 mb-0">
                        <FormControl>
                          <Input placeholder="Enter subtask..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            
            {isPaidAccount && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring-switch"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <label
                  htmlFor="recurring-switch"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this a recurring task
                </label>
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
