
import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BusinessProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ 
  register, 
  watch, 
  errors,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <FormField
        name="business_name"
        render={() => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input
                {...register("business_name")}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your business name"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_name && (
              <FormMessage>{errors.business_name.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="business_type"
        render={() => (
          <FormItem>
            <FormLabel>Business Type</FormLabel>
            <FormControl>
              <Input
                {...register("business_type")}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="E.g. Retail, Service, Consulting"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_type && (
              <FormMessage>{errors.business_type.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="business_address"
        render={() => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                {...register("business_address")}
                className={`min-h-[100px] ${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Brief description of your business"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_address && (
              <FormMessage>{errors.business_address.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormField
          name="business_email"
          render={() => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input
                  {...register("business_email")}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="business@example.com"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_email && (
                <FormMessage>{errors.business_email.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_phone"
          render={() => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input
                  {...register("business_phone")}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="+1 (555) 123-4567"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_phone && (
                <FormMessage>{errors.business_phone.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_website"
          render={() => (
            <FormItem>
              <FormLabel>Business Website</FormLabel>
              <FormControl>
                <Input
                  {...register("business_website")}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="www.example.com"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_website && (
                <FormMessage>{errors.business_website.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BusinessProfileFields;
