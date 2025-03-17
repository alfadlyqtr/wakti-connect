
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/integrations/supabase/types";
import useIsMobile from "@/hooks/use-mobile";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { updateProfileAvatar, updateProfileData } from "@/services/profile/updateProfileService";

interface ProfileTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  const isMobile = useIsMobile();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  
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
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;
    
    try {
      setIsUploading(true);
      const newAvatarUrl = await updateProfileAvatar(profile.id, file);
      setAvatarUrl(newAvatarUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your profile picture.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your public profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${isMobile ? 'flex flex-col' : 'flex items-center'} gap-4 mb-5`}>
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarUrl || profile?.avatar_url || ''} />
              <AvatarFallback>
                {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar">
                <Button 
                  variant="outline" 
                  className="mt-2 sm:mt-0" 
                  disabled={isUploading}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('avatar')?.click();
                  }}
                >
                  {isUploading ? "Uploading..." : "Change Picture"}
                </Button>
              </label>
            </div>
          </div>
          
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
              <textarea
                id="bio"
                className="w-full min-h-[100px] p-2 border rounded-md"
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
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
