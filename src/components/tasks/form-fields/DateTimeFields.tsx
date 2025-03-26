
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Calendar, Clock } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Switch } from "@/components/ui/switch";

interface DateTimeFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form }) => {
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

  return (
    <>
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
    </>
  );
};
