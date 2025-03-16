
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface GalleryImagesGridProps {
  images: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GalleryImagesGrid: React.FC<GalleryImagesGridProps> = ({
  images,
  handleInputChange
}) => {
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    
    // Type assertion for the synthetic event
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  const handleImageCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      caption
    };
    
    // Type assertion for the synthetic event
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  const handleImageAltChange = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      alt
    };
    
    // Type assertion for the synthetic event
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  return (
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
  );
};

export default GalleryImagesGrid;
