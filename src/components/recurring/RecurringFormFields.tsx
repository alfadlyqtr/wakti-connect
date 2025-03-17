
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format, addDays } from 'date-fns';

// Define interface for RecurringFormFields props
interface RecurringFormFieldsProps {
  form: UseFormReturn<any>;
  userRole: "free" | "individual" | "business";
  disabled?: boolean;
}

const DAYS_OF_WEEK = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
  { label: 'Sun', value: 'sunday' },
];

const RecurringFormFields: React.FC<RecurringFormFieldsProps> = ({ form, userRole, disabled = false }) => {
  const frequency = form.watch('recurring.frequency');
  const selectedDays = form.watch('recurring.days_of_week') || [];
  
  // Set default end date when component mounts (30 days from now)
  useEffect(() => {
    const defaultEndDate = addDays(new Date(), 30);
    if (!form.getValues('recurring.end_date')) {
      form.setValue('recurring.end_date', defaultEndDate);
    }
  }, [form]);

  // Handle frequency change side effects
  useEffect(() => {
    if (frequency === 'weekly' && (!selectedDays || selectedDays.length === 0)) {
      // Default to current day of week if none selected
      const today = new Date();
      const dayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const dayValue = DAYS_OF_WEEK[dayIndex === 0 ? 6 : dayIndex - 1].value; // Adjust for our array which starts with Monday
      form.setValue('recurring.days_of_week', [dayValue]);
    }
  }, [frequency, selectedDays, form]);

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={form.control}
          name="recurring.frequency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Repeat Frequency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  disabled={disabled}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  {userRole === 'business' && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yearly" id="yearly" />
                      <Label htmlFor="yearly">Yearly</Label>
                    </div>
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interval - how often the event repeats */}
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

        {/* Days of week selection for weekly frequency */}
        {frequency === 'weekly' && (
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
        )}

        {/* Day of month selection for monthly frequency */}
        {frequency === 'monthly' && (
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
        )}

        {/* End date selection */}
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

        {/* Max occurrences for business accounts */}
        {userRole === 'business' && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringFormFields;
