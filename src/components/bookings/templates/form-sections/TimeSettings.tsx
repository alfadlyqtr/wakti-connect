
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface TimeSettingsProps {
  control: Control<any>;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ control }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="default_starting_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('booking.templateBooking.startHour')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={0} 
                  max={23} 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="default_ending_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('booking.templateBooking.endHour')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={0} 
                  max={23} 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="max_daily_bookings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('booking.maxDailyBookings')} ({t('common.optional')})</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                placeholder={t('booking.templateBooking.noLimit')} 
                {...field}
                value={field.value === undefined ? "" : field.value}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TimeSettings;
