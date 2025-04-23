
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Due Date Field */}
        <FormField
          control={form.control}
          name="due_date" // Changed from dueDate to due_date to match backend
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
        
        {/* Native Time Input */}
        <FormField
          control={form.control}
          name="due_time" // Changed from dueTime to due_time to match backend
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Time</FormLabel>
              <FormControl>
                <input
                  type="time"
                  className="w-full h-9 border rounded px-3 py-1 text-sm"
                  {...field}
                  value={field.value || ""}
                />
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
