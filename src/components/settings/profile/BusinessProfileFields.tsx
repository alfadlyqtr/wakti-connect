
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BusinessHoursField from "./BusinessHoursField";

interface BusinessProfileFieldsProps {
  watch?: any;
  errors?: FieldErrors;
  readOnly?: boolean;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ watch, errors = {}, readOnly = false }) => {
  const navigate = useNavigate();
  const slug = useWatch({ name: 'slug' }) || '';
  const businessName = useWatch({ name: 'business_name' }) || '';
  
  const viewPublicProfile = () => {
    if (slug) {
      // Open in new tab
      window.open(`/${slug}`, '_blank');
    }
  };
  
  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Business Details</CardTitle>
              <CardDescription>Information about your business</CardDescription>
            </div>
            {slug && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={viewPublicProfile}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                <span>View Profile</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your business name"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="e.g. Retail, Healthcare, Consulting"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                    placeholder="Describe what your business does"
                    className="min-h-[100px]"
                    {...field}
                    disabled={readOnly}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
          
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contact Information</CardTitle>
          <CardDescription>How customers can reach your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="contact@yourbusiness.com"
                      type="email"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="www.yourbusiness.com"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
          
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Social Media Links</CardTitle>
          <CardDescription>Connect with customers on social platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="business_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Personal WhatsApp number</FormDescription>
                  <FormMessage />
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
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Business WhatsApp number</FormDescription>
                  <FormMessage />
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
                      placeholder="@yourbusiness"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="https://facebook.com/yourbusiness"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              name="business_google_maps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://maps.google.com/?q=yourbusiness"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Business Hours</CardTitle>
          <CardDescription>When customers can visit or contact you</CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessHoursField />
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">AI Chatbot</CardTitle>
          <CardDescription>Add an AI chatbot to your business profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="business_chatbot_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Enable Chatbot</FormLabel>
                  <FormDescription>
                    Allow customers to interact with a chatbot on your profile
                  </FormDescription>
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
          
          {watch?.("business_chatbot_enabled") && (
            <FormField
              name="business_chatbot_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Embed Code</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste your chatbot embed code here"
                      className="min-h-[150px] font-mono text-xs"
                      {...field}
                      disabled={readOnly}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste the HTML embed code from your chatbot provider
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        {slug && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Your business profile is available at:</p>
            <p className="font-medium break-all">
              {window.location.origin}/{slug}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BusinessProfileFields;
