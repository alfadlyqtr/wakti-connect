
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";
import BusinessHoursField from "./BusinessHoursField";

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
  const { control } = useFormContext();
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Business Information</h3>
        
        <div className="space-y-6">
          {/* Business description */}
          <FormField
            control={control}
            name="business_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your business"
                    className="resize-y"
                    {...field}
                    value={field.value || ''}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          
          {/* Business type */}
          <FormField
            control={control}
            name="business_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Restaurant, Salon, Retail"
                    {...field}
                    value={field.value || ''}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business email */}
            <FormField
              control={control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="business@example.com"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Business phone */}
            <FormField
              control={control}
              name="business_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Business website */}
          <FormField
            control={control}
            name="business_website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.example.com"
                    {...field}
                    value={field.value || ''}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator />
          
          <h3 className="text-lg font-medium mb-4">Social Media & Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <FormField
              control={control}
              name="business_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* WhatsApp Business */}
            <FormField
              control={control}
              name="business_whatsapp_business"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Business</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instagram */}
            <FormField
              control={control}
              name="business_instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@yourbusiness"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Facebook */}
            <FormField
              control={control}
              name="business_facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Page</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="facebook.com/yourbusiness"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Google Maps */}
          <FormField
            control={control}
            name="business_google_maps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Maps Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://maps.google.com/..."
                    {...field}
                    value={field.value || ''}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator />
          
          {/* Business Hours - using the new component */}
          <BusinessHoursField />
          
          <Separator />
          
          <h3 className="text-lg font-medium mb-4">TMW AI Chatbot</h3>
          
          {/* Chatbot toggle */}
          <FormField
            control={control}
            name="business_chatbot_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Enable TMW AI Chatbot</FormLabel>
                  <FormMessage />
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
          
          {/* Chatbot code */}
          {watch("business_chatbot_enabled") && (
            <FormField
              control={control}
              name="business_chatbot_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your TMW AI Chatbot code here"
                      className="min-h-[150px] font-mono text-sm"
                      {...field}
                      value={field.value || ''}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileFields;
