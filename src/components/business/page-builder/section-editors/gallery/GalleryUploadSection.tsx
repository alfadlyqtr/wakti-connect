
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, AlertCircle, Image, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface GalleryUploadSectionProps {
  images: any[];
  handleInputChange: (name: string, value: any) => void;
}

const GalleryUploadSection: React.FC<GalleryUploadSectionProps> = ({
  images,
  handleInputChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      const totalFiles = Math.min(files.length, 5); // Process at most 5 files
      
      // Process each file (up to 5 at once)
      const newImages = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        setProgress(Math.round((i / totalFiles) * 100));
        
        try {
          // Validate file size (5MB max)
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (file.size > MAX_SIZE) {
            toast({
              title: "File too large",
              description: `${file.name} exceeds the 5MB limit`,
              variant: "destructive"
            });
            continue; // Skip this file but try the rest
          }
          
          // Upload the image
          const imageUrl = await uploadBusinessImage(businessId, file, 'gallery');
          
          // Create image object
          newImages.push({
            url: imageUrl,
            alt: file.name.split('.')[0].replace(/[_-]/g, ' '),
            caption: '',
            size: 100 // Default size (percentage)
          });
          
          console.log("Successfully uploaded image:", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      }
      
      setProgress(100);
      
      if (newImages.length === 0) {
        throw new Error("Failed to upload any images");
      }
      
      console.log("New images to add:", newImages);
      
      // Update the content data with the new images
      const updatedImages = [...images, ...newImages];
      
      // Update parent component state
      handleInputChange('images', updatedImages);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${newImages.length} image${newImages.length !== 1 ? 's' : ''}`
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
      setProgress(0);
      
      // Clear the input so the same file can be selected again
      event.target.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <Label>Upload Images</Label>
      
      {/* File upload area */}
      <div className={`border-2 border-dashed rounded-lg ${error ? 'border-destructive' : 'border-input'} p-8 text-center`}>
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
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <span className="font-medium">Uploading... {progress}%</span>
              <div className="w-full max-w-xs h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium text-lg">
                Drag images here or click to upload
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                JPG, PNG, WEBP, GIF up to 5MB each (max 5 files at once)
              </span>
            </>
          )}
        </Label>
        
        {error && (
          <div className="mt-4 text-destructive text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
      
      {/* Alternative quick upload button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('gallery-upload')?.click()}
          disabled={uploading}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Images
        </Button>
      </div>
    </div>
  );
};

export default GalleryUploadSection;
