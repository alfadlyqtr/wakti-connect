
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BusinessHoursField } from "./BusinessHoursField";

interface BusinessProfileFieldsProps {
  watch: any;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ 
  watch, 
  errors, 
  readOnly = false
}) => {
  const navigate = useNavigate();
  const form = watch();
  const slug = useWatch({ name: "slug" });
  
  const handleViewProfile = () => {
    if (slug) {
      window.open(`/${slug}`, '_blank');
    }
  };
  
  return (
    <>
      <h3 className="text-lg font-medium mb-4 flex justify-between items-center">
        <span>Business Information</span>
        {slug && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewProfile}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            View Profile
          </Button>
        )}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your business name"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_name && <FormMessage>{errors.business_name.message}</FormMessage>}
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
                  placeholder="Enter your business type"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_type && <FormMessage>{errors.business_type.message}</FormMessage>}
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
                  placeholder="Enter your business email"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_email && <FormMessage>{errors.business_email.message}</FormMessage>}
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
                  type="tel"
                  placeholder="Enter your business phone"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_phone && <FormMessage>{errors.business_phone.message}</FormMessage>}
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
                  placeholder="e.g., www.yourbusiness.com"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_website && <FormMessage>{errors.business_website.message}</FormMessage>}
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
                  placeholder="Enter a description of your business"
                  rows={3}
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_address && <FormMessage>{errors.business_address.message}</FormMessage>}
            </FormItem>
          )}
        />
      </div>

      <h3 className="text-lg font-medium mt-6 mb-4">Social Media & Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter WhatsApp number"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_whatsapp && <FormMessage>{errors.business_whatsapp.message}</FormMessage>}
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
                  placeholder="Enter WhatsApp Business number"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_whatsapp_business && <FormMessage>{errors.business_whatsapp_business.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Profile</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="@yourbusiness"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_instagram && <FormMessage>{errors.business_instagram.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://facebook.com/yourbusiness"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_facebook && <FormMessage>{errors.business_facebook.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_google_maps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Maps Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Google Maps URL"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50" : ""}
                />
              </FormControl>
              {errors.business_google_maps && <FormMessage>{errors.business_google_maps.message}</FormMessage>}
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <BusinessHoursField />
      </div>
      
      <h3 className="text-lg font-medium mt-6 mb-4">TMW AI Chatbot</h3>
      <div className="space-y-4">
        <FormField
          name="business_chatbot_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Chatbot</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={readOnly}
                  className="mr-2 h-4 w-4"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {watch('business_chatbot_enabled') && (
          <FormField
            name="business_chatbot_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chatbot Embed Code</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Paste your chatbot embed code here"
                    rows={5}
                    readOnly={readOnly}
                    className={readOnly ? "bg-gray-50" : ""}
                  />
                </FormControl>
                {errors.business_chatbot_code && <FormMessage>{errors.business_chatbot_code.message}</FormMessage>}
              </FormItem>
            )}
          />
        )}
      </div>
    </>
  );
};

export default BusinessProfileFields;
