
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // Fix: Properly import the Switch component
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BusinessHoursField from "./BusinessHoursField"; // This import is correct, assuming BusinessHoursField is exported as default

const BusinessProfileFields: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <>
      {/* Business Name Field */}
      <FormField
        control={control}
        name="business_name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your business name" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Type Field */}
      <FormField
        control={control}
        name="business_type"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Type</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Salon, Restaurant, Consulting..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Address/Description Field */}
      <FormField
        control={control}
        name="business_address"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a brief description of your business" 
                className="min-h-[100px]" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Contact Information Section */}
      <FormField
        control={control}
        name="business_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="business@example.com" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Phone</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_website"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Business Website</FormLabel>
            <FormControl>
              <Input placeholder="https://yourbusiness.com" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Social Media Section */}
      <div className="col-span-2">
        <h3 className="text-lg font-medium mb-2">Social Media & Contact</h3>
        <Alert variant="default" className="mb-4 bg-muted/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            These links will be displayed on your business profile page for clients to contact you.
          </AlertDescription>
        </Alert>
      </div>

      <FormField
        control={control}
        name="business_whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp Number</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_whatsapp_business"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp Business Link</FormLabel>
            <FormControl>
              <Input placeholder="https://wa.me/message/..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input placeholder="https://instagram.com/yourbusiness" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input placeholder="https://facebook.com/yourbusiness" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="business_google_maps"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Google Maps Location</FormLabel>
            <FormControl>
              <Input placeholder="https://goo.gl/maps/..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Hours Field */}
      <BusinessHoursField />

      {/* Business Chatbot Section */}
      <FormField
        control={control}
        name="business_chatbot_enabled"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <Card className="border border-input">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">AI Chatbot</div>
                    <div className="text-sm text-muted-foreground">Enable the AI Chatbot on your business page</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="business_chatbot_enabled"
                    />
                    <Label htmlFor="business_chatbot_enabled">
                      {field.value ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
                
                {field.value && (
                  <FormField
                    control={control}
                    name="business_chatbot_code"
                    render={({ field: codeField }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Chatbot Integration Code</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your TMW AI chatbot code here"
                            className="h-[100px] font-mono text-sm"
                            {...codeField}
                            value={codeField.value || ''}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Paste the integration code from your TMW AI chatbot dashboard here.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </FormItem>
        )}
      />

      {/* Business URL Slug Field */}
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Custom URL</FormLabel>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-1 bg-muted px-2 py-1.5 border rounded-l-md border-r-0 border-input">
                yourhost.com/
              </span>
              <FormControl>
                <Input 
                  className="rounded-l-none" 
                  placeholder="your-business-name" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be the custom URL for your public business profile.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BusinessProfileFields;
