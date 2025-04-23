
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { BasicFields } from "./BasicFields";
import { DateTimeFields } from "./DateTimeFields";
import { SubtasksSection } from "./SubtasksSection";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
  // Since enableSubtasks is now part of our schema, we can access it directly
  const enableSubtasks = form.watch("enableSubtasks");

  return (
    <div className="space-y-4">
      {/* Basic task information */}
      <BasicFields form={form} />
      
      {/* Date and time fields */}
      <DateTimeFields form={form} />
      
      {/* Enable subtasks toggle */}
      <FormField
        control={form.control}
        name="enableSubtasks"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Subtasks</FormLabel>
              <div className="text-sm text-muted-foreground">
                Add subtasks to break down this task
              </div>
            </div>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Subtasks Section - ONLY if enabled */}
      {enableSubtasks && (
        <SubtasksSection form={form} />
      )}
    </div>
  );
};

export default TaskFormFields;
