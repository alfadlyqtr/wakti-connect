
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceFormFieldsProps {
  control: Control<any>;
  formatCurrency: (amount: number) => string;
  staffMembers?: { id: string; name: string }[];
}

const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({ control, formatCurrency, staffMembers = [] }) => {
  const isMobile = useIsMobile();
  
  // Get currency symbol from the first formatted value
  const currencySymbol = formatCurrency(0).replace(/[\d.,\s]/g, '');
  
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-base font-medium">Service Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter service name" 
                className="h-12 text-base"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-base font-medium">Description</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[100px] text-base"
                placeholder="Describe your service..."
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-medium">Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-[14px] text-base">{currencySymbol}</span>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    className="pl-12 h-12 text-base" 
                    placeholder="0.00" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-medium">Duration (min) <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="60" 
                    min="1"
                    className="pr-12 h-12 text-base"
                    {...field} 
                  />
                  <span className="absolute right-3 top-[14px] text-muted-foreground text-base">min</span>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {staffMembers.length > 0 && (
        <FormField
          control={control}
          name="assignedStaff"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-medium">Assign Staff (Optional)</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default ServiceFormFields;
