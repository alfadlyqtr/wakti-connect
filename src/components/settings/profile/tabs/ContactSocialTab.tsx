
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ContactSocialTab = () => {
  const { formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h3 className="text-md font-medium">Contact & Social Media</h3>
        <p className="text-sm text-muted-foreground">How customers can reach your business</p>
      </div>
      
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
                  placeholder="contact@yourbusiness.com"
                />
              </FormControl>
              {errors.business_email && (
                <FormMessage>{errors.business_email.message as string}</FormMessage>
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
                  placeholder="Contact phone number"
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
                  placeholder="https://yourbusiness.com"
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
                  placeholder="Google Maps URL"
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
                  placeholder="WhatsApp number"
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
                  placeholder="WhatsApp Business number"
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
                  placeholder="Instagram username/URL"
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
                  placeholder="Facebook page URL"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactSocialTab;
