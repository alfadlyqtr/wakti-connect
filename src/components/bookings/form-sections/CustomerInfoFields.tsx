
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface CustomerInfoFieldsProps {
  control: Control<any>;
}

const CustomerInfoFields: React.FC<CustomerInfoFieldsProps> = ({ control }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">{t('booking.form.customerInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('booking.form.customerName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('booking.form.customerName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="customer_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('booking.form.customerEmail')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="customer@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CustomerInfoFields;
