
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerFieldProps {
  form: UseFormReturn<TaskFormValues>;
  name: "dueTime" | `subtasks.${number}.dueTime`;  // Ensure name is properly typed
  label?: string;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({ 
  form, 
  name,
  label = "Time" 
}) => {
  // Generate time options from 00:00 to 23:45 in 5-minute intervals
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const hourFormatted = hour.toString().padStart(2, '0');
        const minuteFormatted = minute.toString().padStart(2, '0');
        options.push(`${hourFormatted}:${minuteFormatted}`);
      }
    }
    return options;
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value?.toString() || ""}
            value={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px]">
              <SelectItem value="">No specific time</SelectItem>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
