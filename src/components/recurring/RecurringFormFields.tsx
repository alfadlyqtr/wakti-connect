
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RecurrenceFrequency 
} from "@/types/recurring.types";

interface RecurringFormFieldsProps {
  form: UseFormReturn<any>;
  userRole: "free" | "individual" | "business";
}

// Day of the week options
const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const RecurringFormFields: React.FC<RecurringFormFieldsProps> = ({ form, userRole }) => {
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const watchFrequency = form.watch("recurring.frequency");
  const watchIsRecurring = form.watch("isRecurring");
  
  if (!isPaidAccount) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-medium text-amber-800 dark:text-amber-500">Premium Feature</h4>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Recurring tasks and appointments are available on paid plans only. Upgrade to Individual or Business plans to access this feature.
        </p>
      </div>
    );
  }
  
  if (!watchIsRecurring) {
    return null;
  }
  
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h3 className="text-lg font-medium">Recurring Settings</h3>
      <p className="text-sm text-muted-foreground">Configure how often this item repeats</p>
      
      <FormField
        control={form.control}
        name="recurring.frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequency</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
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
            <FormLabel>Interval</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormDescription>
              {watchFrequency === "daily" && "Repeat every X days"}
              {watchFrequency === "weekly" && "Repeat every X weeks"}
              {watchFrequency === "monthly" && "Repeat every X months"}
              {watchFrequency === "yearly" && "Repeat every X years"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {watchFrequency === "weekly" && (
        <FormField
          control={form.control}
          name="recurring.days_of_week"
          render={() => (
            <FormItem>
              <FormLabel>Days of Week</FormLabel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DAYS_OF_WEEK.map((day) => (
                  <FormField
                    key={day.value}
                    control={form.control}
                    name="recurring.days_of_week"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day.value}
                          className="flex flex-row items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                const newValue = checked
                                  ? [...current, day.value]
                                  : current.filter((val: string) => val !== day.value);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {day.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {watchFrequency === "monthly" && (
        <FormField
          control={form.control}
          name="recurring.day_of_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day of Month</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormDescription>
                Choose which day of the month (1-31)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="recurring.end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date (Optional)</FormLabel>
            <FormControl>
              <DatePicker 
                date={field.value} 
                setDate={field.onChange}
                className="w-full"
              />
            </FormControl>
            <FormDescription>
              Leave empty to repeat indefinitely
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recurring.max_occurrences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Occurrences (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                {...field} 
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              Leave empty for no limit
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecurringFormFields;
