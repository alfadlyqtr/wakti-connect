
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RecurrenceFrequency } from '@/types/recurring.types';

interface RecurringFormFieldsProps {
  form: any;
  userRole?: "free" | "individual" | "business";
  isRecurring?: boolean;
}

const RecurringFormFields: React.FC<RecurringFormFieldsProps> = ({ 
  form, 
  userRole = "free",
  isRecurring = false 
}) => {
  if (!isRecurring) return null;

  const isPaidAccount = userRole === "individual" || userRole === "business";
  if (!isPaidAccount) {
    return (
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Recurring tasks are only available for paid accounts. Please upgrade your plan to access this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border rounded-md p-4 mt-4">
      <h3 className="text-md font-medium">Recurring Settings</h3>
      
      <FormField
        control={form.control}
        name="recurring.frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequency</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
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
                min={1} 
                max={99}
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {form.watch('recurring.frequency') === 'weekly' && (
        <FormField
          control={form.control}
          name="recurring.days_of_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of Week</FormLabel>
              <FormControl>
                <RadioGroup 
                  className="flex flex-wrap gap-2" 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex items-center space-x-1">
                      <RadioGroupItem value={String(index + 1)} id={`day-${index + 1}`} />
                      <label htmlFor={`day-${index + 1}`} className="text-sm">{day}</label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {form.watch('recurring.frequency') === 'monthly' && (
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
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="recurring.max_occurrences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End after occurrences</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                max={99}
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecurringFormFields;
