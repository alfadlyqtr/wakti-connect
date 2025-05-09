
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const BasicInfoTab = () => {
  const { formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h3 className="text-md font-medium">Basic Information</h3>
        <p className="text-sm text-muted-foreground">Essential details about your business</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your business name"
                  required
                />
              </FormControl>
              {errors.business_name && (
                <FormMessage>{errors.business_name.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your full name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="How you want to be displayed"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          name="business_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type of business"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Name (Slug)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your-business-name"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Used for your public profile URL
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          name="business_address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px]"
                  placeholder="Describe your business..."
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
