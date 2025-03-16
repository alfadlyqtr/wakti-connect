
import { useState } from "react";
import { updateBusinessLogo } from "@/services/profile/updateProfileService";
import { toast } from "@/components/ui/use-toast";

export const useLogoUpload = (
  businessId?: string, 
  onUploadSuccess?: (logoUrl: string) => void
) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
