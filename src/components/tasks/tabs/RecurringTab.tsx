
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurringTabProps {
  form: UseFormReturn<any>;
  isPaidAccount: boolean;
  isRecurring: boolean;
}

export function RecurringTab({ 
  form, 
  isPaidAccount, 
  isRecurring 
}: RecurringTabProps) {
  
  if (!isPaidAccount) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-muted-foreground mb-2">
          Recurring tasks are available on paid plans.
        </p>
        <Button variant="outline" size="sm">
          Upgrade Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="text-sm text-muted-foreground mb-4">
        Configure how this task should repeat.
      </div>
      
      <FormField
        control={form.control}
        name="recurring.frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repeat Frequency</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!isRecurring}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recurring.interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repeat Every</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                disabled={!isRecurring}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recurring.max_occurrences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Occurrences</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                disabled={!isRecurring}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
