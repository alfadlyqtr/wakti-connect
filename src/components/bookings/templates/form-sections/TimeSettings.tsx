
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TimeSettingsProps {
  control: Control<any>;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ control }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="default_starting_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Starting Hour</FormLabel>
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
              <FormLabel>Default Ending Hour</FormLabel>
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
            <FormLabel>Max Daily Bookings (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                placeholder="Leave empty for unlimited" 
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
