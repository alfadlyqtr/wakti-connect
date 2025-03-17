
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import FrequencySelector from './frequency/FrequencySelector';
import IntervalSelector from './frequency/IntervalSelector';
import DaysOfWeekSelector from './weekly/DaysOfWeekSelector';
import DayOfMonthSelector from './monthly/DayOfMonthSelector';
import EndDateSelector from './EndDateSelector';
import MaxOccurrencesSelector from './business/MaxOccurrencesSelector';
import { addDays } from 'date-fns';

// Define interface for RecurringFormFields props
interface RecurringFormFieldsProps {
  form: UseFormReturn<any>;
  userRole: "free" | "individual" | "business";
  disabled?: boolean;
}

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
      const dayValue = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayIndex];
      form.setValue('recurring.days_of_week', [dayValue]);
    }
  }, [frequency, selectedDays, form]);

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        <FrequencySelector form={form} userRole={userRole} disabled={disabled} />
        <IntervalSelector form={form} userRole={userRole} disabled={disabled} />
        
        {/* Days of week selection for weekly frequency */}
        {frequency === 'weekly' && (
          <DaysOfWeekSelector form={form} disabled={disabled} />
        )}

        {/* Day of month selection for monthly frequency */}
        {frequency === 'monthly' && (
          <DayOfMonthSelector form={form} disabled={disabled} />
        )}

        {/* End date selection */}
        <EndDateSelector form={form} disabled={disabled} />

        {/* Max occurrences for business accounts */}
        {userRole === 'business' && (
          <MaxOccurrencesSelector form={form} disabled={disabled} />
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringFormFields;
