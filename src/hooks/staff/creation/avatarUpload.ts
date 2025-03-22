
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a staff avatar image to storage
 * @deprecated Use useAvatarUpload hook instead for progress tracking
 */
export const uploadStaffAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
  try {
    // Generate a unique filename
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `staff_avatars/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error in avatar upload:", error);
    return null;
  }
};
