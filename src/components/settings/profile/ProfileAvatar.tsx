
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { updateProfileAvatar } from "@/services/profile/updateProfileService";
import { Tables } from "@/integrations/supabase/types";
import { UploadProgress } from "@/components/ui/upload-progress";
import { Upload } from "lucide-react";

interface ProfileAvatarProps {
  profile: Tables<"profiles"> & {
    email?: string;
  };
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 300);
      
      const newAvatarUrl = await updateProfileAvatar(profile.id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Delay to show 100% completion
      setTimeout(() => {
        setAvatarUrl(newAvatarUrl);
        
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully."
        });
        
        setIsUploading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your profile picture.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-20 h-20">
        <AvatarImage src={avatarUrl || profile?.avatar_url || ''} />
        <AvatarFallback>
          {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <UploadProgress 
        progress={uploadProgress} 
        isUploading={isUploading}
        className="w-20"
        size="sm"
      />
      
      <div>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isUploading}
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
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Change Picture
              </>
            )}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ProfileAvatar;
