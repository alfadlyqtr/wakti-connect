
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateProfileData } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";

export interface ProfileFormData {
  display_name: string;
  business_name?: string;
  occupation: string;
  
  // Common fields
  telephone?: string;
  gender?: string;
  date_of_birth?: string;
  
  // Address fields
  country?: string;
  state_province?: string;
  city?: string;
  postal_code?: string;
  street_address?: string;
  po_box?: string;
  
  // Business specific fields
  business_type?: string;
  business_address?: string;
}

export const useProfileForm = (profile?: Tables<"profiles"> & { email?: string }) => {
  const isBusinessAccount = profile?.account_type === 'business';

  const { register, handleSubmit, formState: { isSubmitting }, watch } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: profile?.display_name || '',
      business_name: profile?.business_name || '',
      occupation: profile?.occupation || '',
      telephone: profile?.telephone || '',
      gender: profile?.gender || 'prefer_not_to_say',
      date_of_birth: profile?.date_of_birth || '',
      country: profile?.country || '',
      state_province: profile?.state_province || '',
      city: profile?.city || '',
      postal_code: profile?.postal_code || '',
      street_address: profile?.street_address || '',
      po_box: profile?.po_box || '',
      business_type: profile?.business_type || '',
      business_address: profile?.business_address || ''
    }
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!profile?.id) {
        throw new Error("Profile ID is missing");
      }

      await updateProfileData(profile.id, {
        display_name: data.display_name,
        business_name: data.business_name,
        occupation: data.occupation,
        telephone: data.telephone,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        country: data.country,
        state_province: data.state_province,
        city: data.city,
        postal_code: data.postal_code,
        street_address: data.street_address,
        po_box: data.po_box,
        business_type: data.business_type,
        business_address: data.business_address
      });
      
      toast({
        title: isBusinessAccount ? "Business info updated" : "Profile updated",
        description: isBusinessAccount 
          ? "Your business information has been updated successfully."
          : "Your profile information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your information.",
        variant: "destructive"
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isBusinessAccount,
    watch
  };
};
