
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface SubtasksListProps {
  form: UseFormReturn<TaskFormValues>;
}

export function SubtasksList({ form }: SubtasksListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Subtasks</span>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ content: "", is_completed: false })}
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
          <div key={field.id} className="space-y-2">
            <div className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`subtasks.${idx}.content`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Subtask ${idx + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(idx)}
                className="shrink-0 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 items-center pl-4 border-l-2 border-muted">
              <FormField
                control={form.control}
                name={`subtasks.${idx}.due_date`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`subtasks.${idx}.due_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Due Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
