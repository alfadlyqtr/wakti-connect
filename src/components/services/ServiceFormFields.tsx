
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ServiceFormFieldsProps {
  control: Control<any>;
}

const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter service name" {...field} />
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <textarea
                className="min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2 resize-y"
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
              <FormLabel>Price (QAR)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">QAR</span>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    className="pl-12" 
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
              <FormLabel>Duration (min) <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="60" 
                    min="1"
                    {...field} 
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground">min</span>
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
