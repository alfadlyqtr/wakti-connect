
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DurationAndPriceFieldsProps {
  control: Control<any>;
}

const DurationAndPriceFields: React.FC<DurationAndPriceFieldsProps> = ({ control }) => {
  const serviceId = useWatch({
    control,
    name: "service_id",
  });

  const isLinkedToService = !!serviceId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={5} 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            {isLinkedToService && (
              <FormDescription>
                Auto-filled from linked service
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="Leave empty for variable pricing" 
                {...field}
                value={field.value === undefined ? "" : field.value}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            {isLinkedToService && field.value !== undefined && (
              <FormDescription>
                Auto-filled from linked service
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DurationAndPriceFields;
