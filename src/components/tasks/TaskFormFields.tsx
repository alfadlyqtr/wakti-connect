
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
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
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";
import { Clock, ListChecks, Plus, Trash2, Calendar } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
  // Setup field array for subtasks
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  // Function to convert string date to Date object for DatePicker
  const getDateFromString = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };

  // Function to convert Date object to string for form value
  const getStringFromDate = (date: Date | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  };

  const enableSubtasks = form.watch("enableSubtasks");

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Task Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter task title..." {...field} required />
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
                placeholder="Enter task description..." 
                {...field} 
                className="min-h-[100px]"
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <DatePicker 
                  date={getDateFromString(field.value)} 
                  setDate={(date) => field.onChange(date ? getStringFromDate(date) : "")}
                  className="w-full"
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
      
      {/* Subtasks Toggle */}
      <div className="flex items-center space-x-2 pt-2">
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
      
      {/* Subtasks/To-Do List Section - only shown if enabled */}
      {enableSubtasks && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Subtasks
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ content: "", is_completed: false, due_date: null, due_time: null })}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Subtask
            </Button>
          </div>
          
          {fields.length === 0 && (
            <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md text-center">
              No subtasks added yet. Click the button above to add one.
            </div>
          )}
          
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2 p-3 border rounded-md">
              <FormField
                control={form.control}
                name={`subtasks.${index}.content`}
                render={({ field }) => (
                  <FormItem className="mb-0">
                    <FormControl>
                      <Input placeholder="Enter subtask..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <FormField
                  control={form.control}
                  name={`subtasks.${index}.due_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Due Date</FormLabel>
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
                      <FormLabel className="text-xs">Due Time</FormLabel>
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
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="w-full mt-1"
              >
                <Trash2 className="h-4 w-4 mr-1 text-muted-foreground" /> Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TaskFormFields;
