
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DayOfMonthSelectorProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const DayOfMonthSelector: React.FC<DayOfMonthSelectorProps> = ({ form, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="recurring.day_of_month"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Day of month</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              min={1}
              max={31}
              className="w-20"
              disabled={disabled}
            />
          </FormControl>
          <FormDescription>
            The appointment will repeat on this day each month
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DayOfMonthSelector;
