
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const AddressTab = () => {
  const { formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h3 className="text-md font-medium">Address Information</h3>
        <p className="text-sm text-muted-foreground">Physical location details for your business</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="street_address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Street address"
                />
              </FormControl>
              {errors.street_address && (
                <FormMessage>{errors.street_address.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="City"
                />
              </FormControl>
              {errors.city && (
                <FormMessage>{errors.city.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="state_province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="State or province"
                />
              </FormControl>
              {errors.state_province && (
                <FormMessage>{errors.state_province.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Postal code"
                />
              </FormControl>
              {errors.postal_code && (
                <FormMessage>{errors.postal_code.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Country"
                />
              </FormControl>
              {errors.country && (
                <FormMessage>{errors.country.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="po_box"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PO Box</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="PO Box number if applicable"
                />
              </FormControl>
              {errors.po_box && (
                <FormMessage>{errors.po_box.message as string}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressTab;
