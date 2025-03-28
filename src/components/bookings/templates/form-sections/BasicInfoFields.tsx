
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFieldsProps {
  control: Control<any>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ control }) => {
  const serviceId = useWatch({
    control,
    name: "service_id",
  });

  const isLinkedToService = !!serviceId;

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pre-Booking Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., One-hour Consultation" {...field} />
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe this pre-booking" 
                {...field} 
                value={field.value || ""} 
              />
            </FormControl>
            {isLinkedToService && field.value && (
              <FormDescription>
                Auto-filled from linked service
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
