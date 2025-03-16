
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormSchema";
import { Clock, ListChecks, Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
  // Setup field array for subtasks
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks"
  });

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Task Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter task title..." {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter task description..." 
                {...field} 
                className="min-h-[100px]"
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    setDate={field.onChange}
                    className="w-full"
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
                  <div className="flex items-center space-x-2 rounded-md border border-input bg-background px-3 h-10">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      {...field}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Set time"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Subtasks/To-Do List Section */}
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
            onClick={() => append({ content: "", is_completed: false })}
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
          <div key={field.id} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`subtasks.${index}.content`}
              render={({ field }) => (
                <FormItem className="flex-1 mb-0">
                  <FormControl>
                    <Input placeholder="Enter subtask..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-10 w-10 p-0"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskFormFields;
