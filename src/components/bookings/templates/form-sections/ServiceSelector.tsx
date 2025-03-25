
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/types/service.types";

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
  return (
    <FormField
      control={control}
      name="service_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Linked Service (Auto-fills Pre-Booking Name)</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value === "none" ? undefined : value);
              onServiceChange(value);
            }}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ServiceSelector;
