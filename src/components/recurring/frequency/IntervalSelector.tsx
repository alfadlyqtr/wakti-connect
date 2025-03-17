
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface IntervalSelectorProps {
  form: UseFormReturn<any>;
  userRole: "free" | "individual" | "business";
  disabled?: boolean;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = ({ form, userRole, disabled = false }) => {
  const frequency = form.watch('recurring.frequency');
  
  return (
    <FormField
      control={form.control}
      name="recurring.interval"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Repeat every</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                min={1}
                max={userRole === 'business' ? 99 : 12}
                className="w-16"
                disabled={disabled}
              />
              <span>
                {frequency === 'daily' ? 'day(s)' :
                 frequency === 'weekly' ? 'week(s)' :
                 frequency === 'monthly' ? 'month(s)' : 'year(s)'}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IntervalSelector;
