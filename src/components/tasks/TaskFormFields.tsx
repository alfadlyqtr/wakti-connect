
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
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
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
        
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DatePicker 
                  date={field.value} 
                  setDate={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default TaskFormFields;
