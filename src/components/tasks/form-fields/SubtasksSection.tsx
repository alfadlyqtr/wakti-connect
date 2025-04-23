
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

// New: subtask group title and list of subtasks as simple strings
export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ form, enableSubtasks }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  // "Group Title" lives in its own form field, not inside subtasks
  return enableSubtasks ? (
    <div className="space-y-4 border rounded-lg p-4 bg-[#F1F0FB] dark:bg-[#1A1F2C] mt-1">
      <FormField
        control={form.control}
        name="subtaskGroupTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtask Group Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Lulu Grocery Store" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Subtasks</span>
          <Button variant="outline" size="sm" type="button"
            onClick={() => append({ content: "" })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Subtask
          </Button>
        </div>
        {fields.length === 0 && (
          <div className="text-sm text-muted-foreground py-2 px-2">
            No subtasks yet.
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
                      <Input placeholder={`e.g. Milk`} {...field} />
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
  ) : null;
};
