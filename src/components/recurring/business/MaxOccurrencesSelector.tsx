
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface MaxOccurrencesSelectorProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const MaxOccurrencesSelector: React.FC<MaxOccurrencesSelectorProps> = ({ form, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="recurring.max_occurrences"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Maximum occurrences</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
              min={1}
              max={100}
              placeholder="No limit"
              disabled={disabled}
            />
          </FormControl>
          <FormDescription>
            Optional: limit the number of recurring appointments
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MaxOccurrencesSelector;
