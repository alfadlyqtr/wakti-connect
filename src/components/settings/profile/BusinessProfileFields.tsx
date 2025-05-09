
import React from "react";
import { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Separator } from "@/components/ui/separator";
import BusinessHoursField from "./BusinessHoursField";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BusinessProfileFieldsProps {
  watch?: any;
  errors: FieldErrors<ProfileFormData>;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ 
  watch, 
  errors,
  readOnly = false
}) => {
  const chatbotEnabled = watch?.("business_chatbot_enabled");
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Business Name - Ensuring this field is present */}
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
                  placeholder="Type of business"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_type && (
                <FormMessage>{errors.business_type.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-5">
        <FormField
          name="business_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""} min-h-[100px]`}
                  placeholder="Describe your business"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_address && (
                <FormMessage>{errors.business_address.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      <Separator className="my-6" />
      <h3 className="text-lg font-medium mb-4">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  placeholder="+123456789"
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
                  placeholder="https://example.com"
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
      
      <Separator className="my-6" />
      <h3 className="text-lg font-medium mb-4">Social Media</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="+123456789"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_whatsapp && (
                <FormMessage>{errors.business_whatsapp.message}</FormMessage>
              )}
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
                  placeholder="+123456789"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_whatsapp_business && (
                <FormMessage>{errors.business_whatsapp_business.message}</FormMessage>
              )}
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
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="@your_instagram"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_instagram && (
                <FormMessage>{errors.business_instagram.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          name="business_facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="facebook.com/your_page"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_facebook && (
                <FormMessage>{errors.business_facebook.message}</FormMessage>
              )}
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
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="Google Maps URL"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_google_maps && (
                <FormMessage>{errors.business_google_maps.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      <Separator className="my-6" />
      <h3 className="text-lg font-medium mb-4">Business Hours</h3>
      
      <BusinessHoursField />
      
      <Separator className="my-6" />
      <h3 className="text-lg font-medium mb-4">TMW AI Chatbot</h3>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <FormField
            name="business_chatbot_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={readOnly}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label htmlFor="chatbot-enabled">
                    Enable TMW AI Chatbot
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add an AI chatbot to your business page
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {chatbotEnabled && (
          <FormField
            name="business_chatbot_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chatbot Code</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className={`${readOnly ? "bg-gray-50" : ""} min-h-[150px] font-mono text-sm`}
                    placeholder="Paste your chatbot code here"
                    readOnly={readOnly}
                  />
                </FormControl>
                {errors.business_chatbot_code && (
                  <FormMessage>{errors.business_chatbot_code.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        )}
      </div>
    </>
  );
};

export default BusinessProfileFields;
