
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface PublishToggleProps {
  control: Control<any>;
}

const PublishToggle: React.FC<PublishToggleProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="is_published"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              Publish Pre-Booking
            </FormLabel>
            <p className="text-sm text-muted-foreground">
              Make this pre-booking visible to customers on your booking page
            </p>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PublishToggle;
