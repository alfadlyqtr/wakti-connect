
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/types/service.types";
import { useTranslation } from "react-i18next";

interface ServiceSelectorProps {
  control: Control<any>;
  services: Service[];
  onServiceChange: (value: string) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  control, 
  services,
  onServiceChange 
}) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={control}
      name="service_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('booking.linkToService')}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value === "none" ? undefined : value);
              onServiceChange(value);
            }}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('booking.selectService')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">{t('common.none')}</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} ({service.duration} {t('booking.minutes')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            {t('booking.serviceSelectionDescription')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ServiceSelector;
