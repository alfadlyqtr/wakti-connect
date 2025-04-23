import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { BasicFields } from "./BasicFields";
import { DateTimeFields } from "./DateTimeFields";
import { SubtasksSection } from "./SubtasksSection";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
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
                Add a list of subtasks to this task
              </div>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormItem>
        )}
      />
      
      {/* Subtasks Section - ONLY if enabled, shows basic inline quick subtasks, no "group title" */}
      <SubtasksSection
        form={form}
        enableSubtasks={enableSubtasks}
      />
    </div>
  );
};

export default TaskFormFields;
