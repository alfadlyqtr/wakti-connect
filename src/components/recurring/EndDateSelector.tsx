
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

interface EndDateSelectorProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const EndDateSelector: React.FC<EndDateSelectorProps> = ({ form, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="recurring.end_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>End date</FormLabel>
          <FormControl>
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              className="w-full"
              disabled={disabled}
            />
          </FormControl>
          <FormDescription>
            The recurring appointments will end on this date
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EndDateSelector;
