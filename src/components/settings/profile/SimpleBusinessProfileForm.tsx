
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { CardContent } from "@/components/ui/card";
import { updateProfileData } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

// Define a type that has only the essential fields we need
interface EssentialBusinessFields {
  business_name: string;
  business_email?: string;
  business_phone?: string;
  business_website?: string;
  business_address?: string; // Used as business description
  slug?: string;
}

interface SimpleBusinessProfileFormProps {
  profile?: Tables<"profiles"> & {
    email?: string;
    business_email?: string;
    business_phone?: string;
    business_website?: string;
  };
}

const SimpleBusinessProfileForm: React.FC<SimpleBusinessProfileFormProps> = ({ profile }) => {
  const form = useForm<EssentialBusinessFields>({
    defaultValues: {
      business_name: profile?.business_name || '',
      business_email: (profile as any)?.business_email || '',
      business_phone: (profile as any)?.business_phone || '',
      business_website: (profile as any)?.business_website || '',
      business_address: profile?.business_address || '',
      slug: profile?.slug || ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const onSubmit = async (data: EssentialBusinessFields) => {
    try {
      if (!profile?.id) {
        throw new Error("Profile ID is missing");
      }

      // Only update essential fields
      await updateProfileData(profile.id, {
        business_name: data.business_name,
        business_email: data.business_email,
        business_phone: data.business_phone,
        business_website: data.business_website,
        business_address: data.business_address,
        slug: data.slug
      } as any);
      
      toast({
        title: "Business information saved",
        description: "Your essential business information has been updated successfully.",
        variant: "success"
      });
    } catch (error: any) {
      console.error("Error updating business profile:", error);
      
      let errorMessage = "There was a problem updating your business information.";
      
      if (error.message && error.message.includes("business with this name already exists")) {
        form.setError('business_name', { 
          type: 'manual',
          message: 'This business name is already registered. Please choose a different name.' 
        });
        errorMessage = "This business name is already registered. Please choose a different name.";
      } else if (error.message && error.message.includes("business with this email already exists")) {
        form.setError('business_email', { 
          type: 'manual',
          message: 'This business email is already registered. Please use a different email.' 
        });
        errorMessage = "This business email is already registered. Please use a different email.";
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="business_name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Your business name"
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
                      type="tel"
                      placeholder="+1234567890"
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
                      type="url"
                      placeholder="https://yourbusiness.com"
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
                      placeholder="your-business-name"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Used for your public profile URL
                  </p>
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
                      placeholder="Describe your business..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Business Information"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default SimpleBusinessProfileForm;
