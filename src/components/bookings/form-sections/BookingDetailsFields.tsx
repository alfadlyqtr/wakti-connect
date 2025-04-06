
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface BookingDetailsFieldsProps {
  control: Control<any>;
}

const BookingDetailsFields: React.FC<BookingDetailsFieldsProps> = ({ control }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('booking.bookingDetails')}</h3>
      
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('booking.form.title')}</FormLabel>
            <FormControl>
              <Input placeholder={t('booking.enterBookingTitle')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('booking.form.description')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('booking.enterBookingDescription')} 
                className="min-h-[80px]" 
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BookingDetailsFields;
