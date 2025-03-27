import React from "react";
import { FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IndividualProfileFieldsProps {
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ 
  errors,
  readOnly = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Individual-specific fields */}
      <FormField
        name="telephone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter your phone number"
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </FormControl>
            {errors.telephone && <FormMessage>{errors.telephone.message}</FormMessage>}
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
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </FormControl>
            {errors.state_province && <FormMessage>{errors.state_province.message}</FormMessage>}
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
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </FormControl>
            {errors.city && <FormMessage>{errors.city.message}</FormMessage>}
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
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </FormControl>
            {errors.postal_code && <FormMessage>{errors.postal_code.message}</FormMessage>}
          </FormItem>
        )}
      />
      
      <FormField
        name="street_address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Street address"
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </FormControl>
            {errors.street_address && <FormMessage>{errors.street_address.message}</FormMessage>}
          </FormItem>
        )}
      />
    </div>
  );
};

export default IndividualProfileFields;
