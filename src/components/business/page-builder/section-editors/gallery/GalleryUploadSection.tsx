
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { supabase } from "@/integrations/supabase/client";

interface GalleryUploadSectionProps {
  images: any[];
  handleInputChange: (name: string, value: any) => void;
}

const GalleryUploadSection: React.FC<GalleryUploadSectionProps> = ({
  images,
  handleInputChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      const file = files[0];
      
      // Reset progress before starting a new upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) return 95;
          return prev + 5;
        });
      }, 100);
      
      // Upload the image
      const imageUrl = await uploadBusinessImage(businessId, file, 'gallery');
      
      // Clear the interval and set to 100% when done
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Create a new image object
      const newImage = {
        url: imageUrl,
        alt: file.name.split('.')[0].replace(/[_-]/g, ' '),
        caption: ""
      };
      
      // Update the images array
      const updatedImages = [...images, newImage];
      handleInputChange("images", updatedImages);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the gallery"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Clear the input so the same file can be selected again
      e.target.value = "";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-6 text-center">
        <input
          type="file"
          id="gallery-image-upload"
          className="hidden"
          onChange={handleImageUpload}
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
        />
        <label
          htmlFor="gallery-image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="mb-3">
            {uploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="font-medium mb-1">
            {uploading ? "Uploading..." : "Upload Image"}
          </div>
          <p className="text-sm text-muted-foreground">
            {uploading ? `${uploadProgress}% complete` : "JPG, PNG or WebP (max 5MB)"}
          </p>
        </label>
      </div>
      
      {uploading && (
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>After uploading, go to the "Images" tab to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Rearrange images (drag & drop)</li>
          <li>Add captions to your images</li>
          <li>Delete unwanted images</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryUploadSection;
