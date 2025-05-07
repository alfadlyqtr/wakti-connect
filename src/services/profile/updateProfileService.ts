
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Uploads a file to the business assets storage bucket
 */
export const uploadBusinessImage = async (
  businessId: string,
  file: File,
  folder: string = 'general'
): Promise<string> => {
  try {
    console.log(`Starting upload of ${file.name} to ${folder} folder for business ${businessId}`);
    
    // Check if the bucket exists, if not, try to create it
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
      
    const bucketExists = buckets?.some(b => b.name === 'business-assets');
    
    if (!bucketExists) {
      console.warn('Bucket business-assets does not exist, uploads will fail');
      // Note: we can't create buckets from client-side
      throw new Error('Upload storage is not configured. Please contact support.');
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${businessId}/${folder}/${fileName}`;
    
    console.log(`Uploading file to ${filePath}`);
    
    // Upload the file
    const { error: uploadError, data: uploadData } = await supabase
      .storage
      .from('business-assets')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    console.log("Upload successful:", uploadData);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-assets')
      .getPublicUrl(filePath);
      
    console.log("Public URL generated:", publicUrl);
      
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadBusinessImage:", error);
    throw error;
  }
};

/**
 * Updates the business logo for a business profile
 */
export const updateBusinessLogo = async (
  businessId: string,
  file: File
): Promise<string> => {
  try {
    // Upload the image using the shared function
    const logoUrl = await uploadBusinessImage(businessId, file, 'logos');
    
    // Update the profile record with the new logo URL
    const { error } = await supabase
      .from('business_pages')
      .update({ logo_url: logoUrl })
      .eq('business_id', businessId);
      
    if (error) throw error;
    
    return logoUrl;
  } catch (error) {
    console.error("Error updating business logo:", error);
    toast({
      variant: "destructive",
      title: "Logo update failed",
      description: error instanceof Error ? error.message : "Failed to update logo"
    });
    throw error;
  }
};

/**
 * Updates the profile avatar for a user
 */
export const updateProfileAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${userId}/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update the profile record
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
      
    if (error) throw error;
    
    return publicUrl;
  } catch (error) {
    console.error("Error updating profile avatar:", error);
    toast({
      variant: "destructive",
      title: "Avatar update failed",
      description: error instanceof Error ? error.message : "Failed to update avatar"
    });
    throw error;
  }
};

/**
 * Updates user profile data
 */
export const updateProfileData = async (
  userId: string,
  profileData: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
      
    if (error) throw error;
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    toast({
      variant: "destructive",
      title: "Update failed",
      description: error instanceof Error ? error.message : "Failed to update profile"
    });
    throw error;
  }
};
