
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface EditTaskDateTimeFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

export const EditTaskDateTimeFields: React.FC<EditTaskDateTimeFieldsProps> = ({
  form,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <input
                type="date"
                className="w-full h-9 border rounded px-3 py-1 text-sm"
                {...field}
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
  );
};
