
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskFormValues } from "@/components/tasks/TaskFormSchema";

interface RecurringFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  userRole: "free" | "individual" | "business";
}

const RecurringFormFields: React.FC<RecurringFormFieldsProps> = ({ form, userRole }) => {
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  if (!isPaidAccount) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Recurring tasks are only available for paid accounts. Please upgrade your plan to access this feature.
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pl-6 border-l-2">
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
            <FormLabel>Repeat every</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                min={1}
              />
            </FormControl>
            <FormDescription>
              {form.watch("recurring.frequency") === "daily" && "days"}
              {form.watch("recurring.frequency") === "weekly" && "weeks"}
              {form.watch("recurring.frequency") === "monthly" && "months"}
              {form.watch("recurring.frequency") === "yearly" && "years"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Weekly-specific options */}
      {form.watch("recurring.frequency") === "weekly" && (
        <FormField
          control={form.control}
          name="recurring.days_of_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of Week</FormLabel>
              <div className="flex flex-wrap gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={field.value?.includes(index.toString())}
                      onCheckedChange={(checked) => {
                        const dayStr = index.toString();
                        const currentDays = field.value || [];
                        
                        if (checked) {
                          field.onChange([...currentDays, dayStr]);
                        } else {
                          field.onChange(
                            currentDays.filter(d => d !== dayStr)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`day-${index}`} className="text-sm">{day}</label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Monthly-specific options */}
      {form.watch("recurring.frequency") === "monthly" && (
        <FormField
          control={form.control}
          name="recurring.day_of_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day of Month</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                  min={1}
                  max={31}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* End configuration */}
      <FormField
        control={form.control}
        name="recurring.max_occurrences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Occurrences</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                min={1}
                placeholder="No limit"
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
