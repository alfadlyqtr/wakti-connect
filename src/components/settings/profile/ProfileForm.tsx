
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
  const isBusinessAccount = profile?.account_type === 'business';

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {isBusinessAccount ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="displayName">Position</Label>
              <Input 
                id="displayName" 
                placeholder="Account Admin" 
                {...register("display_name")} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                placeholder="Your business name" 
                {...register("business_name")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Business Description</Label>
              <Textarea
                id="bio"
                className="w-full min-h-[100px]"
                placeholder="Tell us about your business"
                {...register("occupation")}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="displayName">Username</Label>
              <Input 
                id="displayName" 
                placeholder="Username" 
                {...register("display_name")} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="w-full min-h-[100px]"
                placeholder="Tell us about yourself"
                {...register("occupation")}
              />
            </div>
          </>
        )}
        
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (isBusinessAccount ? "Save Business Info" : "Save Profile")}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
