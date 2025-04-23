
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SubtasksSectionProps {
  form: UseFormReturn<TaskFormValues>;
  enableSubtasks: boolean;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ form, enableSubtasks }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  // Only render if subtasks are enabled
  if (!enableSubtasks) {
    return null;
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-[#F1F0FB] dark:bg-[#1A1F2C] mt-1">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Subtasks</span>
          <Button variant="outline" size="sm" type="button"
            onClick={() => append({ content: "", isCompleted: false })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Subtask
          </Button>
        </div>
        {fields.length === 0 && (
          <div className="text-sm text-muted-foreground py-2 px-2">
            No subtasks yet. Add your first subtask.
          </div>
        )}
        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div className="flex gap-2 items-center" key={field.id}>
              <FormField
                control={form.control}
                name={`subtasks.${idx}.content`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder={`Subtask ${idx + 1}`} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(idx)}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
