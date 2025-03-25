
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/types/service.types";
import { StaffMember } from "@/types/staff";

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
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Service & Staff</h3>
      <FormField
        control={control}
        name="service_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onServiceChange(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
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
            <FormLabel>Assign Staff (Optional)</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff" />
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
