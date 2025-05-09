
import React from "react";
import { UseFormWatch, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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
      
      <Separator className="my-2" />
      <h3 className="text-sm font-medium text-gray-700">Social Media & Contact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="+1 (555) 123-4567"
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
                  placeholder="+1 (555) 123-4567"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_whatsapp_business && (
                <FormMessage>{errors.business_whatsapp_business.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="your_instagram"
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
              <FormLabel>Facebook ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${readOnly ? "bg-gray-50" : ""}`}
                  placeholder="your.facebook.page"
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_facebook && (
                <FormMessage>{errors.business_facebook.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        name="business_google_maps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Maps Location URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                className={`${readOnly ? "bg-gray-50" : ""}`}
                placeholder="https://maps.google.com/..."
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_google_maps && (
              <FormMessage>{errors.business_google_maps.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <Separator className="my-2" />
      <h3 className="text-sm font-medium text-gray-700">Business Hours</h3>
      
      <FormField
        name="business_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Hours</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={`min-h-[100px] ${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Monday: 9:00 AM - 5:00 PM&#10;Tuesday: 9:00 AM - 5:00 PM&#10;Wednesday: 9:00 AM - 5:00 PM&#10;Thursday: 9:00 AM - 5:00 PM&#10;Friday: 9:00 AM - 5:00 PM&#10;Saturday: Closed&#10;Sunday: Closed"
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_hours && (
              <FormMessage>{errors.business_hours.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <Separator className="my-2" />
      <h3 className="text-sm font-medium text-gray-700">TMW AI Chatbot</h3>
      
      <FormField
        name="business_chatbot_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                disabled={readOnly}
                className="h-4 w-4 mt-1"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Enable TMW AI Chatbot</FormLabel>
              <p className="text-sm text-muted-foreground">
                Add a TMW AI chatbot to your business page
              </p>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        name="business_chatbot_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TMW AI Chatbot Code</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={`min-h-[150px] font-mono text-sm ${readOnly ? "bg-gray-50" : ""}`}
                placeholder="Paste your TMW AI Chatbot code here..."
                readOnly={readOnly}
              />
            </FormControl>
            {errors.business_chatbot_code && (
              <FormMessage>{errors.business_chatbot_code.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessProfileFields;
