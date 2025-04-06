
import React from "react";
import { Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface BasicInfoFieldsProps {
  control: Control<any>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ control }) => {
  const { t } = useTranslation();
  
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
            <FormLabel>{t('booking.templateBooking.templateName')}</FormLabel>
            <FormControl>
              <Input placeholder={t('booking.templateNamePlaceholder')} {...field} />
            </FormControl>
            {isLinkedToService && (
              <FormDescription>
                {t('booking.autoFilledFromService')}
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
            <FormLabel>{t('booking.description')} ({t('common.optional')})</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('booking.templateBooking.descriptionPlaceholder')} 
                {...field} 
                value={field.value || ""} 
              />
            </FormControl>
            {isLinkedToService && field.value && (
              <FormDescription>
                {t('booking.autoFilledFromService')}
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
