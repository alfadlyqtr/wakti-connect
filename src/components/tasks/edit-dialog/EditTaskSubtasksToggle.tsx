
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface EditTaskSubtasksToggleProps {
  form: UseFormReturn<TaskFormValues>;
}

export const EditTaskSubtasksToggle: React.FC<EditTaskSubtasksToggleProps> = ({
  form,
}) => {
  return (
    <FormField
      control={form.control}
      name="enableSubtasks"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Enable Subtasks</FormLabel>
            <div className="text-sm text-muted-foreground">
              Add and manage subtasks for this task
            </div>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
