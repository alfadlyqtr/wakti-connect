
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

      setUploadProgress({ progress: 0, isComplete: false });

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('staff-avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress({ progress: percent, isComplete: percent === 100 });
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('staff-avatars')
        .getPublicUrl(filePath);

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully",
      });

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
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
