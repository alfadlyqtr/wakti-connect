
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface PublishToggleProps {
  control: Control<any>;
}

const PublishToggle: React.FC<PublishToggleProps> = ({ control }) => {
  const { t } = useTranslation();
  
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
            <FormLabel className="text-base">{t('booking.publishPreBooking')}</FormLabel>
            <FormDescription>
              {isLinkedToService 
                ? t('booking.linkedServicePublishDesc')
                : t('booking.publishPreBookingDesc')}
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
