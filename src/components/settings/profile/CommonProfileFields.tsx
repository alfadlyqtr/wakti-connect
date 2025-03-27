import React from "react";
import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface CommonProfileFieldsProps {
  watch?: any;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
  canEditBasicInfo?: boolean;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({ 
  watch, 
  errors,
  readOnly = false,
  canEditBasicInfo = false
}) => {
  // Staff can always edit display_name and occupation regardless of overall permissions
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly && !canEditBasicInfo ? "bg-gray-50" : ""}`}
                placeholder="Your display name"
                readOnly={readOnly && !canEditBasicInfo}
              />
            </FormControl>
            {errors.display_name && (
              <FormMessage>{errors.display_name.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly && !canEditBasicInfo ? "bg-gray-50" : ""}`}
                placeholder="Your occupation"
                readOnly={readOnly && !canEditBasicInfo}
              />
            </FormControl>
            {errors.occupation && (
              <FormMessage>{errors.occupation.message}</FormMessage>
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your country"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.country && (
              <FormMessage>{errors.country.message}</FormMessage>
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your state or province"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.state_province && (
              <FormMessage>{errors.state_province.message}</FormMessage>
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your city"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.city && (
              <FormMessage>{errors.city.message}</FormMessage>
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your postal code"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.postal_code && (
              <FormMessage>{errors.postal_code.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="street_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your street address"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.street_address && (
              <FormMessage>{errors.street_address.message}</FormMessage>
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your PO Box"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.po_box && (
              <FormMessage>{errors.po_box.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default CommonProfileFields;
