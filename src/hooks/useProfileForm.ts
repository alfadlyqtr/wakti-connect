
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateProfileData } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";

export interface ProfileFormData {
  display_name: string;
  business_name?: string;
  occupation: string;
}

export const useProfileForm = (profile?: Tables<"profiles"> & { email?: string }) => {
  const isBusinessAccount = profile?.account_type === 'business';

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: profile?.display_name || '',
      business_name: profile?.business_name || '',
      occupation: profile?.occupation || ''
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
        occupation: data.occupation
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
    isBusinessAccount
  };
};
