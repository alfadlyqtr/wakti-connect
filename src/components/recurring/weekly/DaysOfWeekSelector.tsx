
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DAYS_OF_WEEK } from '../constants';

interface DaysOfWeekSelectorProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const DaysOfWeekSelector: React.FC<DaysOfWeekSelectorProps> = ({ form, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="recurring.days_of_week"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Repeat on</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={field.value?.includes(day.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = field.value || [];
                    const newValues = checked
                      ? [...currentValues, day.value]
                      : currentValues.filter((value: string) => value !== day.value);
                    field.onChange(newValues);
                  }}
                  disabled={disabled}
                />
                <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DaysOfWeekSelector;
