
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Add this import
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useWatch } from "react-hook-form";
import BusinessHoursField from "./BusinessHoursField"; // Fixed import

interface BusinessProfileFieldsProps {
  watch: any;
  errors: any;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ 
  watch, 
  errors, 
  readOnly = false 
}) => {
  const navigate = useNavigate();
  const slug = useWatch({ name: 'slug' });
  const businessName = watch('business_name');

  // Function to view public business profile
  const viewPublicProfile = () => {
    if (slug) {
      // Open in a new tab
      window.open(`/business/${slug}`, '_blank');
    }
  };

  return (
    <div>
      <div className="border border-border rounded-lg p-4 space-y-4 mb-6">
        <h3 className="text-lg font-medium">Business Information</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your business name"
                    disabled={readOnly}
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
                    placeholder="e.g., Retail, Restaurant, Salon"
                    disabled={readOnly}
                  />
                </FormControl>
                {errors.business_type && (
                  <FormMessage>{errors.business_type.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          name="business_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe your business"
                  disabled={readOnly}
                  className="min-h-24"
                />
              </FormControl>
              {errors.business_address && (
                <FormMessage>{errors.business_address.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {slug && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Public URL: </span>
              <span className="font-medium break-all">/business/{slug}</span>
            </div>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
              onClick={viewPublicProfile}
            >
              View Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="border border-border rounded-lg p-4 space-y-4 mb-6">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            name="business_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="contact@yourbusiness.com"
                    disabled={readOnly}
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
                    placeholder="+1 (555) 123-4567"
                    disabled={readOnly}
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
                    placeholder="https://www.yourbusiness.com"
                    disabled={readOnly}
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
      
      <div className="border border-border rounded-lg p-4 space-y-4 mb-6">
        <h3 className="text-lg font-medium">Social Media & Integrations</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            name="business_whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+1 (555) 123-4567"
                    disabled={readOnly}
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
                <FormLabel>WhatsApp Business Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://wa.me/message/YOURLINK"
                    disabled={readOnly}
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
                    placeholder="https://instagram.com/yourbusiness"
                    disabled={readOnly}
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
                <FormLabel>Facebook Profile</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://facebook.com/yourbusiness"
                    disabled={readOnly}
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
                <FormLabel>Google Maps Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://goo.gl/maps/yourlocation"
                    disabled={readOnly}
                  />
                </FormControl>
                {errors.business_google_maps && (
                  <FormMessage>{errors.business_google_maps.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Business Hours Section */}
      <div className="border border-border rounded-lg p-4 space-y-4 mb-6">
        <h3 className="text-lg font-medium">Business Hours</h3>
        <BusinessHoursField />
      </div>

      {/* Chatbot Integration Section */}
      <div className="border border-border rounded-lg p-4 space-y-4 mb-6">
        <h3 className="text-lg font-medium">Customer Support Chatbot</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enable a customer support chatbot on your public business profile.
        </p>
        
        <FormField
          name="business_chatbot_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Chatbot
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Display a support chatbot on your public profile
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
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
                <FormLabel>Chatbot Code (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Paste your custom chatbot code here"
                    disabled={readOnly}
                    className="min-h-24 font-mono text-sm"
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground">
                  You can paste embed code from third-party chatbot providers
                </div>
                {errors.business_chatbot_code && (
                  <FormMessage>{errors.business_chatbot_code.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessProfileFields;
