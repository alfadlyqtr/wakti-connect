
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/types/service.types";
import { StaffMember } from "@/types/staff";
import { useTranslation } from "react-i18next";

interface StaffServiceFieldsProps {
  control: Control<any>;
  services: Service[];
  staff: StaffMember[];
  onServiceChange: (serviceId: string) => void;
}

const StaffServiceFields: React.FC<StaffServiceFieldsProps> = ({ 
  control, 
  services, 
  staff,
  onServiceChange
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">{t('booking.form.serviceStaff')}</h3>
      <FormField
        control={control}
        name="service_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('booking.service')}</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onServiceChange(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('booking.form.selectService')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="staff_assigned_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('booking.form.selectStaff')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('booking.form.selectStaff')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {staff.map((staffMember) => (
                  <SelectItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StaffServiceFields;
