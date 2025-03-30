
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

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
          <FormItem>
            <FormLabel className="text-base">Service Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter service name" 
                {...field} 
                className="h-12 text-base"
              />
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
            <FormLabel className="text-base">Description</FormLabel>
            <FormControl>
              <textarea
                className="min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-base resize-y"
                placeholder="Describe your service..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Price (QAR)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-base">QAR</span>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    className="pl-12 h-12 text-base" 
                    placeholder="0.00" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Duration (min) <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="60" 
                    min="1"
                    className="h-12 text-base pr-12"
                    {...field} 
                  />
                  <span className="absolute right-3 top-3 text-muted-foreground text-base">min</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ServiceFormFields;
