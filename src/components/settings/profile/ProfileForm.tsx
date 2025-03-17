
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateProfileData } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";

interface ProfileFormProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      display_name: profile?.display_name || '',
      business_name: profile?.business_name || '',
      occupation: profile?.occupation || ''
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      if (!profile?.id) {
        throw new Error("Profile ID is missing");
      }

      const updatedProfile = await updateProfileData(profile.id, {
        display_name: data.display_name,
        business_name: data.business_name,
        occupation: data.occupation
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            placeholder="Display name" 
            {...register("display_name")} 
          />
        </div>
        
        {profile?.account_type === 'business' && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input 
              id="businessName" 
              placeholder="Business name" 
              {...register("business_name")}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            className="w-full min-h-[100px]"
            placeholder="Tell us about yourself"
            {...register("occupation")}
          />
        </div>
        
        <Button 
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
