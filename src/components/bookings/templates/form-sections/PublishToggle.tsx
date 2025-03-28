
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface PublishToggleProps {
  control: Control<any>;
}

const PublishToggle: React.FC<PublishToggleProps> = ({ control }) => {
  const serviceId = useWatch({
    control,
    name: "service_id",
  });

  const isLinkedToService = !!serviceId;

  return (
    <FormField
      control={control}
      name="is_published"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Publish Pre-Booking</FormLabel>
            <FormDescription>
              {isLinkedToService 
                ? "This booking is linked to a service and will be published on your business page."
                : "Make this pre-booking available on your business page."}
            </FormDescription>
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
