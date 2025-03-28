
import { useState } from "react";
import { updateBusinessLogo } from "@/services/profile/updateProfileService";
import { toast } from "@/components/ui/use-toast";

export const useLogoUpload = (
  businessId?: string, 
  onUploadSuccess?: (logoUrl: string) => void
) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Handle both direct File uploads and event-based uploads
  const handleLogoUpload = async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    let file: File | undefined;
    
    // Check if the input is a File or an event
    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else if (fileOrEvent.target && fileOrEvent.target.files) {
      file = fileOrEvent.target.files[0];
    }
    
    if (!file || !businessId) return;
    
    try {
      setUploadingLogo(true);
      const logoUrl = await updateBusinessLogo(businessId, file);
      
      if (onUploadSuccess) {
        onUploadSuccess(logoUrl);
      }
      
      toast({
        title: "Logo uploaded",
        description: "Your business logo has been updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload logo"
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  return {
    uploadingLogo,
    handleLogoUpload
  };
};
