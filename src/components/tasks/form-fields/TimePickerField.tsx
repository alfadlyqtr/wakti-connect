
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
import { TimePicker } from "@/components/ui/time-picker";

interface TimePickerFieldProps {
  form: UseFormReturn<TaskFormValues>;
  name: "due_time" | `subtasks.${number}.due_time`;
  label?: string;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({ 
  form, 
  name,
  label = "Time" 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
  );
};
