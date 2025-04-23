import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface SubtasksTabProps {
  form: UseFormReturn<any>;
  enableSubtasks: boolean;
}

export function SubtasksTab({ form, enableSubtasks }: SubtasksTabProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  if (!enableSubtasks) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-muted-foreground mb-2">
          Enable subtasks first on the Details tab to access this section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Manage Subtasks</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ content: "", isCompleted: false })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Subtask
        </Button>
      </div>
      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
          No subtasks added yet. Click the button above to add one.
        </div>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-md p-4 space-y-3">
          <FormField
            control={form.control}
            name={`subtasks.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtask {index + 1}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subtask content..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Remove Subtask
          </Button>
        </div>
      ))}
    </div>
  );
}
