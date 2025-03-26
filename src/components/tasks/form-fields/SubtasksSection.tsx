
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerField } from "./TimePickerField";

interface SubtasksSectionProps {
  form: UseFormReturn<TaskFormValues>;
  enableSubtasks: boolean;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ 
  form, 
  enableSubtasks 
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="enableSubtasks"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Enable Subtasks</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {enableSubtasks && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Subtasks</h3>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ content: "", isCompleted: false, dueDate: "", dueTime: "" })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Subtask
            </Button>
          </div>
          
          {fields.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-2">
              No subtasks added yet
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-3 space-y-3">
                  <div className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.isCompleted`}
                      render={({ field: checkboxField }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Checkbox
                              checked={checkboxField.value}
                              onCheckedChange={checkboxField.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.content`}
                      render={({ field: contentField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Subtask description"
                              {...contentField}
                            />
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
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Due Date for Subtask */}
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.dueDate`}
                      render={({ field: dueDateField }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-xs">Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal text-sm h-8",
                                    !dueDateField.value && "text-muted-foreground"
                                  )}
                                >
                                  {dueDateField.value ? (
                                    format(new Date(dueDateField.value), "PPP")
                                  ) : (
                                    <span>Optional</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dueDateField.value ? new Date(dueDateField.value) : undefined}
                                onSelect={(date) => dueDateField.onChange(date?.toISOString() || "")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    
                    {/* Due Time for Subtask */}
                    <TimePickerField 
                      form={form} 
                      name={`subtasks.${index}.dueTime`} 
                      label="Due Time" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
