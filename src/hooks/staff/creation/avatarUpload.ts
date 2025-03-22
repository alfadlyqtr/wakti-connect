
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads and sets a staff avatar image
 * @param userId User ID to associate with the avatar
 * @param avatar File to upload
 * @returns Promise with the avatar URL or null if upload failed
 */
export const uploadStaffAvatar = async (userId: string, avatar?: File): Promise<string | null> => {
  if (!avatar) return null;
  
  try {
    // Create a unique filename for the staff avatar
    const fileExt = avatar.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `staff-profiles/${fileName}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(filePath, avatar);
      
    if (uploadError) throw uploadError;
    
    // Get public URL of the uploaded image
    const { data } = supabase.storage
      .from('profile_images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading staff avatar:", error);
    return null;
  }
};
