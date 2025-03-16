
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { supabase } from "@/integrations/supabase/client";

interface GalleryUploadSectionProps {
  images: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GalleryUploadSection: React.FC<GalleryUploadSectionProps> = ({
  images,
  handleInputChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      
      // Process each file (up to 5 at once)
      const uploadPromises = Array.from(files).slice(0, 5).map(async (file) => {
        try {
          const imageUrl = await uploadBusinessImage(businessId, file, 'gallery');
          
          return {
            url: imageUrl,
            alt: file.name.split('.')[0],
            caption: ''
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      });
      
      // Wait for all uploads to complete
      const newImages = await Promise.all(uploadPromises);
      
      // Update the content data with the new images
      const updatedImages = [...images, ...newImages];
      
      // Use type assertion to fix TypeScript errors with synthetic events
      handleInputChange({
        target: {
          name: 'images',
          value: updatedImages
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${newImages.length} images`
      });
      
    } catch (err) {
      console.error("Error in upload process:", err);
      setError(err instanceof Error ? err.message : "Failed to upload images");
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload images"
      });
    } finally {
      setUploading(false);
      
      // Clear the input so the same file can be selected again
      event.target.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Upload Images</Label>
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <Input
          type="file"
          id="gallery-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={uploading}
        />
        <Label htmlFor="gallery-upload" className="w-full cursor-pointer flex flex-col items-center">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          <span className="font-medium">
            {uploading ? "Uploading..." : "Click to upload images"}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            JPG, PNG, WEBP, GIF up to 5MB each
          </span>
        </Label>
        
        {error && (
          <div className="mt-4 text-destructive text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryUploadSection;
