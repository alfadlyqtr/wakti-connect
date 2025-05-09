
import React from "react";
import { FieldErrors, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BusinessHoursField from "./BusinessHoursField";

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
    <>
      <div className="space-y-2 mb-6">
        <h3 className="font-medium text-lg">Business Details</h3>
        <p className="text-muted-foreground text-sm">
          Enter your business information that will be displayed to customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your business name"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
                  required
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
                  placeholder="Type of business"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
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
                  placeholder="Business contact email"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
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
                  placeholder="Business contact phone"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
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
                  placeholder="https://yourwebsite.com"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_website && <FormMessage>{errors.business_website.message}</FormMessage>}
            </FormItem>
          )}
        />
        
        <FormField
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business URL Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your-business-name"
                  className={readOnly ? "bg-gray-50" : ""}
                  readOnly={readOnly}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Used for your public profile: example.com/business/<span className="font-mono">{field.value || 'your-slug'}</span>
              </p>
              {errors.slug && <FormMessage>{errors.slug.message}</FormMessage>}
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="font-medium text-lg mb-2">Social Media & Contact</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add your business social media accounts and messaging channels
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            name="business_whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp (Personal)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+1234567890"
                    className={readOnly ? "bg-gray-50" : ""}
                    readOnly={readOnly}
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
                    placeholder="+1234567890"
                    className={readOnly ? "bg-gray-50" : ""}
                    readOnly={readOnly}
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
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="@yourbusiness"
                    className={readOnly ? "bg-gray-50" : ""}
                    readOnly={readOnly}
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
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="facebook.com/yourbusiness"
                    className={readOnly ? "bg-gray-50" : ""}
                    readOnly={readOnly}
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
                <FormLabel>Google Maps Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://maps.google.com/..."
                    className={readOnly ? "bg-gray-50" : ""}
                    readOnly={readOnly}
                  />
                </FormControl>
                {errors.business_google_maps && <FormMessage>{errors.business_google_maps.message}</FormMessage>}
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="font-medium text-lg mb-2">Business Description</h3>
        <FormField
          name="business_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Describe your business..."
                  className={`w-full h-32 px-3 py-2 border rounded-md ${readOnly ? "bg-gray-50" : ""}`}
                  readOnly={readOnly}
                />
              </FormControl>
              {errors.business_address && <FormMessage>{errors.business_address.message}</FormMessage>}
              <p className="text-xs text-muted-foreground mt-1">
                This field is used for your business description on your public profile.
              </p>
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="font-medium text-lg mb-2">Business Hours</h3>
        <BusinessHoursField />
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="font-medium text-lg mb-2">Widget and Chatbot</h3>
        <div className="space-y-4">
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
                    <Label htmlFor="business_chatbot_enabled">Enable Chatbot on Business Page</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an AI-powered chatbot to your business page
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          {watch("business_chatbot_enabled") && (
            <FormField
              name="business_chatbot_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Integration Code</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Paste your chatbot integration code here..."
                      className={`w-full h-32 px-3 py-2 border rounded-md ${readOnly ? "bg-gray-50" : ""}`}
                      readOnly={readOnly}
                    />
                  </FormControl>
                  {errors.business_chatbot_code && <FormMessage>{errors.business_chatbot_code.message}</FormMessage>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Paste your chatbot provider's integration code here (e.g. Drift, Intercom, etc.)
                  </p>
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessProfileFields;
