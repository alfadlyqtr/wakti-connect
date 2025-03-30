
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { updateProfileAvatar } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";

interface ProfileAvatarProps {
  profile: Tables<"profiles"> & {
    email?: string;
  };
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);

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
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
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
            className="w-full sm:w-auto"
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
  );
};

export default ProfileAvatar;
