import React from "react";
import { UseFormWatch, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BusinessProfileFieldsProps {
  watch: UseFormWatch<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ 
  watch, 
  errors,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <FormField
        name="business_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input
                {...field}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Type</FormLabel>
            <FormControl>
              <Input
                {...field}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input
                  {...field}
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Website</FormLabel>
              <FormControl>
                <Input
                  {...field}
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
