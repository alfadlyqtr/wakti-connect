
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
import { Switch } from "@/components/ui/switch";

interface DateTimeFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form }) => {
  const isRecurring = form.watch("isRecurring");
  
  // Generate time options for the select dropdown
  const getTimeOptions = () => {
    const options = [];
    
    // Generate time options in 15-minute intervals (12-hour format)
    for (let hour = 0; hour < 24; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
      
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayText = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        options.push({ value: timeValue, label: displayText });
      }
    }
    
    return options;
  };
  
  const timeOptions = getTimeOptions();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Due Date Field */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="w-full h-9 border rounded px-3 py-1 text-sm"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Simple Time Dropdown */}
        <FormField
          control={form.control}
          name="dueTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Time</FormLabel>
              <FormControl>
                <select 
                  className="w-full h-9 border rounded px-3 py-1 text-sm"
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Recurring Task Switch */}
      <FormField
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Recurring Task</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Recurring Options */}
      {isRecurring && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border rounded-lg p-4 bg-muted/20">
          <FormField
            control={form.control}
            name="recurring.frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    {...field}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recurring.interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Every</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    {...field}
                    value={field.value || "1"}
                    onChange={e => field.onChange(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 14, 21, 28].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};
