
import React, { useState } from "react";
import { EditorProps } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Upload, Image, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { supabase } from "@/integrations/supabase/client";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { templates } = useSectionTemplates('gallery');
  
  // Ensure we have default data structure
  const images = contentData.images || [];
  
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
      
      // Create a synthetic event to update the content data
      const syntheticEvent = {
        target: {
          name: 'images',
          value: updatedImages
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
      
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
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    
    // Create a synthetic event to update the content data
    const syntheticEvent = {
      target: {
        name: 'images',
        value: updatedImages
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleImageCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      caption
    };
    
    // Create a synthetic event to update the content data
    const syntheticEvent = {
      target: {
        name: 'images',
        value: updatedImages
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleImageAltChange = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      alt
    };
    
    // Create a synthetic event to update the content data
    const syntheticEvent = {
      target: {
        name: 'images',
        value: updatedImages
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleLayoutChange = (layout: string) => {
    // Create a synthetic event to update the content data
    const syntheticEvent = {
      target: {
        name: 'layout',
        value: layout
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const applyTemplate = (templateContent: any) => {
    // Apply template properties selectively, preserving existing images
    if (templateContent.title) {
      const syntheticEvent = {
        target: {
          name: 'title',
          value: templateContent.title
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
    
    if (templateContent.layout) {
      const syntheticEvent = {
        target: {
          name: 'layout',
          value: templateContent.layout
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
    
    if (templateContent.showCaptions !== undefined) {
      const syntheticEvent = {
        target: {
          name: 'showCaptions',
          value: templateContent.showCaptions
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Gallery Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || "Our Gallery"}
          onChange={handleInputChange}
          placeholder="Our Gallery"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="layout">Gallery Layout</Label>
          <Select
            value={contentData.layout || "grid"}
            onValueChange={handleLayoutChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Display Options</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCaptions"
              checked={contentData.showCaptions || false}
              onChange={(e) => {
                const syntheticEvent = {
                  target: {
                    name: 'showCaptions',
                    value: e.target.checked
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                
                handleInputChange(syntheticEvent);
              }}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showCaptions">Show Captions</Label>
          </div>
        </div>
      </div>
      
      {templates && templates.length > 0 && (
        <div className="space-y-2">
          <Label>Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <Button 
                key={template.id} 
                variant="outline" 
                size="sm"
                onClick={() => applyTemplate(template.template_content)}
              >
                {template.template_name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
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
      
      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Gallery Images ({images.length})</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full h-8 w-8"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor={`image-alt-${index}`} className="text-xs">
                      Alt Text
                    </Label>
                    <Input
                      id={`image-alt-${index}`}
                      value={image.alt || ''}
                      onChange={(e) => handleImageAltChange(index, e.target.value)}
                      placeholder="Describe the image"
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`image-caption-${index}`} className="text-xs">
                      Caption
                    </Label>
                    <Input
                      id={`image-caption-${index}`}
                      value={image.caption || ''}
                      onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                      placeholder="Image caption"
                      className="h-8 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEditor;
