
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../AppointmentFormSchema";
import { AppointmentTimeFields } from "../AppointmentTimeFields";

interface DateTimeFieldsProps {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form, disabled = false }) => {
  const watchIsAllDay = form.watch("isAllDay");

  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <DatePicker 
                date={field.value} 
                setDate={field.onChange}
                className="w-full"
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isAllDay"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>All-day Event</FormLabel>
              <FormDescription>
                Toggle if this is an all-day event
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {!watchIsAllDay && <AppointmentTimeFields form={form} disabled={disabled} />}
    </>
  );
};
