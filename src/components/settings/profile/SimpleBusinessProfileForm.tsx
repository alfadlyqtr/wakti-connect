import React from "react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileWithEmail } from "@/hooks/useProfileSettings";
import { Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";

// Import components for each tab
import BasicInfoTab from "./tabs/BasicInfoTab";
import ContactSocialTab from "./tabs/ContactSocialTab";
import AddressTab from "./tabs/AddressTab";

type BusinessProfileFormProps = {
  profile: ProfileWithEmail;
}

const SimpleBusinessProfileForm = ({ profile }: BusinessProfileFormProps) => {
  const { updateProfile, isUpdating } = useProfileSettings();
  
  const form = useForm({
    defaultValues: {
      // Basic info fields
      business_name: profile.business_name || "",
      display_name: profile.display_name || "",
      full_name: profile.full_name || "",
      business_type: profile.business_type || "",
      business_address: profile.business_address || "", // Used as description
      email: profile.email || "",
      slug: profile.slug || "",
      
      // Contact & Social fields
      business_email: profile.business_email || "",
      business_phone: profile.business_phone || "",
      business_website: profile.business_website || "",
      business_whatsapp: profile.business_whatsapp || "",
      business_whatsapp_business: profile.business_whatsapp_business || "",
      business_instagram: profile.business_instagram || "",
      business_facebook: profile.business_facebook || "",
      business_google_maps: profile.business_google_maps || "",
      
      // Address fields
      country: profile.country || "",
      state_province: profile.state_province || "",
      city: profile.city || "",
      postal_code: profile.postal_code || "",
      street_address: profile.street_address || "",
      po_box: profile.po_box || "",

      // Other fields
      telephone: profile.telephone || "",
      occupation: profile.occupation || "",
    }
  });
  
  const onSubmit = async (data: any) => {
    await updateProfile(data);
  };
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="basic-info" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="contact-social">Contact & Social</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info" className="space-y-4">
              <BasicInfoTab />
            </TabsContent>
            
            <TabsContent value="contact-social" className="space-y-4">
              <ContactSocialTab />
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <AddressTab />
            </TabsContent>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="bg-wakti-blue hover:bg-wakti-blue/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save All Changes"}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </form>
    </FormProvider>
  );
};

export default SimpleBusinessProfileForm;
