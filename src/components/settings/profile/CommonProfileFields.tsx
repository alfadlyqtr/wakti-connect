
import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface CommonProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
  canEditBasicInfo?: boolean;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({ 
  register, 
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
        render={() => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input
                {...register("display_name")}
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
        render={() => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <FormControl>
              <Input
                {...register("occupation")}
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
        render={() => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input
                {...register("country")}
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
        render={() => (
          <FormItem>
            <FormLabel>State/Province</FormLabel>
            <FormControl>
              <Input
                {...register("state_province")}
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
        render={() => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input
                {...register("city")}
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
        render={() => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input
                {...register("postal_code")}
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
        render={() => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                {...register("street_address")}
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
        render={() => (
          <FormItem>
            <FormLabel>PO Box</FormLabel>
            <FormControl>
              <Input
                {...register("po_box")}
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
