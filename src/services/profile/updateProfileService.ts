
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithEmail } from "@/hooks/useProfileSettings";

// Check if the profile_images bucket exists and create it if not
export const initializeProfileStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'profile_images');
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket('profile_images', {
        public: true, // Make files publicly accessible
        fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
      });
      
      if (error) throw error;
      console.log("Created profile_images bucket");
    }
  } catch (error) {
    console.error("Error initializing profile storage:", error);
  }
};

// Update profile with form data
export const updateProfileData = async (
  profileId: string,
  data: Partial<ProfileWithEmail>
) => {
  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId)
    .select()
    .single();
    
  if (error) throw error;
  return updatedProfile;
};

// Update avatar image
export const updateProfileAvatar = async (
  profileId: string,
  file: File
): Promise<string> => {
  // Initialize storage if needed
  await initializeProfileStorage();
  
  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${profileId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  
  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from('profile_images')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('profile_images')
    .getPublicUrl(filePath);
  
  if (!urlData.publicUrl) throw new Error("Failed to get public URL");
  
  // Update the profile with the new avatar URL
  await updateProfileData(profileId, { avatar_url: urlData.publicUrl });
  
  return urlData.publicUrl;
};
