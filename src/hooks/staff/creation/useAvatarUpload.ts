
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UploadProgress {
  progress: number;
  error: string | null;
  uploading: boolean;
  url: string | null;
}

export function useAvatarUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    error: null,
    uploading: false,
    url: null
  });

  const uploadAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      setUploadProgress(prev => ({ ...prev, uploading: true, error: null }));
      
      // Generate a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `staff_avatars/${fileName}`;
      
      // Create a custom upload function that tracks progress
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(avatarFile);
      
      const uploadWithProgress = () => new Promise<string | null>((resolve, reject) => {
        fileReader.onload = async () => {
          try {
            // Upload the file to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, avatarFile, {
                cacheControl: '3600',
                upsert: true
              });
              
            if (uploadError) {
              console.error("Error uploading avatar:", uploadError);
              setUploadProgress(prev => ({ 
                ...prev, 
                uploading: false,
                error: uploadError.message
              }));
              reject(uploadError);
              return;
            }
            
            // Simulate progress updates
            const progressInterval = setInterval(() => {
              setUploadProgress(prev => {
                const newProgress = Math.min(prev.progress + 15, 90);
                return { ...prev, progress: newProgress };
              });
            }, 200);
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
              
            clearInterval(progressInterval);
            setUploadProgress({ 
              progress: 100, 
              uploading: false, 
              error: null,
              url: publicUrl
            });
            
            resolve(publicUrl);
          } catch (error: any) {
            console.error("Error in avatar upload:", error);
            setUploadProgress(prev => ({ 
              ...prev, 
              uploading: false,
              error: error?.message || "Upload failed"
            }));
            reject(error);
          }
        };
        
        fileReader.onerror = () => {
          setUploadProgress(prev => ({ 
            ...prev, 
            uploading: false,
            error: "Failed to read file"
          }));
          reject(new Error("Failed to read file"));
        };
      });
      
      return await uploadWithProgress();
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setUploadProgress(prev => ({ 
        ...prev, 
        uploading: false,
        error: error?.message || "Upload failed"
      }));
      return null;
    }
  };

  return { uploadAvatar, uploadProgress };
}
