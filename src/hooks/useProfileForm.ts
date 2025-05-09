
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateProfileData } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";
import { generateSlug } from "@/utils/string-utils";

export interface ProfileFormData {
  display_name: string;
  business_name?: string;
  occupation: string;
  
  // Address fields
  country?: string;
  state_province?: string;
  city?: string;
  postal_code?: string;
  street_address?: string;
  po_box?: string;
  
  // Business specific fields
  business_type?: string;
  business_address?: string; // Used as business description
  business_email?: string;
  business_phone?: string;
  business_website?: string;
  slug?: string;
  
  // Contact fields
  telephone?: string;
}

interface ProfileFormOptions {
  canEdit?: boolean;
  isStaff?: boolean;
}

export const useProfileForm = (
  profile?: Tables<"profiles"> & { email?: string },
  options: ProfileFormOptions = {}
) => {
  const { canEdit = true, isStaff = false } = options;
  const isBusinessAccount = profile?.account_type === 'business';

  const form = useForm<ProfileFormData>({
    defaultValues: {
      display_name: profile?.display_name || '',
      business_name: profile?.business_name || '',
      occupation: profile?.occupation || '',
      country: profile?.country || '',
      state_province: profile?.state_province || '',
      city: profile?.city || '',
      postal_code: profile?.postal_code || '',
      street_address: profile?.street_address || '',
      po_box: profile?.po_box || '',
      business_type: profile?.business_type || '',
      business_address: profile?.business_address || '', // Business description
      // Business contact fields - might be from extensions
      business_email: (profile as any)?.business_email || '',
      business_phone: (profile as any)?.business_phone || '',
      business_website: (profile as any)?.business_website || '',
      slug: profile?.slug || '',
      telephone: profile?.telephone || '',
    }
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!profile?.id) {
        throw new Error("Profile ID is missing");
      }
      
      // If user is staff, they can't update profile
      if (isStaff) {
        toast({
          title: "Permission denied",
          description: "Staff members cannot update profile information.",
          variant: "destructive"
        });
        return;
      }

      // For business accounts, update the slug if business name has changed
      let updatedSlug = data.slug;
      if (isBusinessAccount && 
          data.business_name && 
          data.business_name !== profile.business_name &&
          !data.slug) {
        updatedSlug = generateSlug(data.business_name);
      }
      
      // Regular update for users with full permissions
      await updateProfileData(profile.id, {
        display_name: data.display_name,
        business_name: data.business_name,
        occupation: data.occupation,
        country: data.country,
        state_province: data.state_province,
        city: data.city,
        postal_code: data.postal_code,
        street_address: data.street_address,
        po_box: data.po_box,
        business_type: data.business_type,
        business_address: data.business_address, // Business description
        // Cast as any to avoid TypeScript errors since these fields might not be in the profile type yet
        business_email: data.business_email as any,
        business_phone: data.business_phone as any,
        business_website: data.business_website as any,
        slug: updatedSlug,
        telephone: data.telephone
      });
      
      if (updatedSlug && updatedSlug !== data.slug) {
        form.setValue('slug', updatedSlug);
      }
      
      toast({
        title: isBusinessAccount ? "Business info updated" : "Profile updated",
        description: isBusinessAccount 
          ? "Your business information has been updated successfully."
          : "Your profile information has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Handle specific uniqueness constraint errors
      let errorMessage = "There was a problem updating your information.";
      
      if (error.message && error.message.includes("profile with this display name already exists")) {
        form.setError('display_name', { 
          type: 'manual',
          message: 'This display name is already in use. Please choose a different one.' 
        });
        errorMessage = "This display name is already in use. Please choose a different one.";
      } else if (error.message && error.message.includes("business with this name already exists")) {
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
      } else if (error.message && error.message.includes("slug already exists")) {
        form.setError('slug', { 
          type: 'manual',
          message: 'This profile URL is already taken. Please choose a different one.' 
        });
        errorMessage = "This profile URL is already taken. Please try a different one.";
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    isBusinessAccount,
    watch: form.watch,
    errors: form.formState.errors
  };
};
