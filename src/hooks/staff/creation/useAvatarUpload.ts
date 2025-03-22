
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAvatarUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `staff_avatars/${fileName}`;
      
      // Upload the file to Supabase Storage with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
        
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message || "Failed to upload image",
          variant: "destructive"
        });
        return null;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      toast({
        title: "Upload successful",
        description: "Profile image has been uploaded"
      });
        
      return publicUrl;
    } catch (error) {
      console.error("Error in avatar upload:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploadProgress,
    isUploading
  };
};
