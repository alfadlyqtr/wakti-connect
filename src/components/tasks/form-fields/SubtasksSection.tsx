
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { ListChecks, Plus, Trash2 } from "lucide-react";

interface SubtasksSectionProps {
  form: UseFormReturn<TaskFormValues>;
  enableSubtasks: boolean;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ 
  form, 
  enableSubtasks 
}) => {
  // Setup field array for subtasks
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  if (!enableSubtasks) {
    return null;
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          Subtasks
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ content: "", is_completed: false, due_date: null, due_time: null })}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Subtask
        </Button>
      </div>
      
      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md text-center">
          No subtasks added yet. Click the button above to add one.
        </div>
      )}
      
      {fields.map((field, index) => (
        <SubtaskItem
          key={field.id}
          form={form}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
};

interface SubtaskItemProps {
  form: UseFormReturn<TaskFormValues>;
  index: number;
  onRemove: () => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ form, index, onRemove }) => {
  return (
    <div className="space-y-2 p-3 border rounded-md">
      <FormField
        control={form.control}
        name={`subtasks.${index}.content`}
        render={({ field }) => (
          <FormItem className="mb-0">
            <FormControl>
              <Input placeholder="Enter subtask..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
        <FormField
          control={form.control}
          name={`subtasks.${index}.due_date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Due Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  value={field.value || ""}
                  max={form.watch("due_date")} // Can't exceed main task due date
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={`subtasks.${index}.due_time`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Due Time</FormLabel>
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
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="w-full mt-1"
      >
        <Trash2 className="h-4 w-4 mr-1 text-muted-foreground" /> Remove
      </Button>
    </div>
  );
};
