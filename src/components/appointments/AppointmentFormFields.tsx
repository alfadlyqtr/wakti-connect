
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { UseFormReturn } from "react-hook-form";
import { AppointmentTimeFields } from "./AppointmentTimeFields";
import { AppointmentFormValues } from "./AppointmentFormSchema";

interface AppointmentFormFieldsProps {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean; // Add disabled prop
}

export const AppointmentFormFields: React.FC<AppointmentFormFieldsProps> = ({ form, disabled = false }) => {
  const watchIsAllDay = form.watch("isAllDay");

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter appointment title..." {...field} required disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter appointment details..." 
                {...field} 
                className="min-h-[80px]"
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter location..." {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
