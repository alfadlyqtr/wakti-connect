
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

export interface UploadProgress {
  progress: number;
  isComplete: boolean;
}

export const useAvatarUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isComplete: false,
  });

  const uploadAvatar = async (userId: string, avatarFile: File): Promise<string> => {
    try {
      if (!avatarFile) {
        throw new Error("No file selected");
      }

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Set initial progress
      setUploadProgress({ progress: 10, isComplete: false });

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('staff-avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      // Set progress to 50% after upload starts
      setUploadProgress({ progress: 50, isComplete: false });

      if (uploadError) {
        throw uploadError;
      }

      // Set progress to 75% after successful upload
      setUploadProgress({ progress: 75, isComplete: false });

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('staff-avatars')
        .getPublicUrl(filePath);

      // Set progress to 100% after getting URL
      setUploadProgress({ progress: 100, isComplete: true });

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully",
      });

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setUploadProgress({ progress: 0, isComplete: false });
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add isUploading property derived from progress
  const isUploading = uploadProgress.progress > 0 && !uploadProgress.isComplete;

  return {
    uploadAvatar,
    uploadProgress,
    isUploading
  };
};
