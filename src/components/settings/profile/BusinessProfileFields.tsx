
import React from "react";
import { FieldErrors, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/hooks/useProfileForm";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField
        name="business_name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Your business name"
                readOnly={readOnly}
                required
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
                placeholder="Type of business"
                readOnly={readOnly}
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
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="your-business-name"
                readOnly={readOnly}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Used for your public profile URL
            </p>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="contact@yourbusiness.com"
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
                placeholder="Contact phone number"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="https://yourbusiness.com"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="WhatsApp number"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_whatsapp_business"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp Business</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="WhatsApp Business number"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Instagram username/URL"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Facebook page URL"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_google_maps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Maps</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Google Maps URL"
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Business Address/Description (Textarea) */}
      <FormField
        name="business_address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={`min-h-[100px] ${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Describe your business..."
                readOnly={readOnly}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessProfileFields;
