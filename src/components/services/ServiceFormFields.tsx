
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormFieldsProps {
  control: Control<any>;
}

const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({ control }) => {
  const isMobile = useIsMobile();
  
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
              <FormLabel className="text-base font-medium">Price (QAR)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-[14px] text-base">QAR</span>
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
    </>
  );
};

export default ServiceFormFields;
