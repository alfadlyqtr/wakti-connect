
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";

interface TaskDetailsTabProps {
  form: UseFormReturn<any>;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  isPaidAccount: boolean;
}

export function TaskDetailsTab({
  form,
  isRecurring,
  setIsRecurring,
  isPaidAccount
}: TaskDetailsTabProps) {
  const enableSubtasks = form.watch("enableSubtasks");

  // Explicitly hardcode English values
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "medium": return "Medium";
      case "normal": return "Normal";
      default: return "Select Priority";
    }
  };
  
  return (
    <div className="space-y-4 pt-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Task Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter task title" {...field} />
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
                placeholder="Enter task description"
                className="resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                  <SelectValue>
                    {field.value ? getPriorityLabel(field.value) : "Select Priority"}
                  </SelectValue>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Due Date
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Native Time Picker */}
        <FormField 
          control={form.control}
          name="due_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Time</FormLabel>
              <FormControl>
                <input
                  type="time"
                  className="w-full h-9 border rounded px-3 py-1 text-sm"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
        {isPaidAccount && (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                id="recurring-switch"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </FormControl>
            <FormLabel
              htmlFor="recurring-switch"
              className="cursor-pointer font-medium"
            >
              Make this recurring
            </FormLabel>
          </FormItem>
        )}
        
        <FormField
          control={form.control}
          name="enableSubtasks"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-medium">
                Enable Subtasks
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
