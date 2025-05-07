
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
    
    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from('business-assets')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-assets')
      .getPublicUrl(filePath);
      
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
