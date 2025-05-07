
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown, Eye, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GalleryImagesSectionProps {
  images: any[];
  handleInputChange: (name: string, value: any) => void;
}

const GalleryImagesSection: React.FC<GalleryImagesSectionProps> = ({
  images,
  handleInputChange
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-muted-foreground/20 rounded-md">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">No Images Added Yet</h3>
        <p className="text-muted-foreground mt-1">Use the Upload tab to add images to your gallery.</p>
      </div>
    );
  }
  
  // Move an image up in the array
  const moveImageUp = (index: number) => {
    if (index <= 0) return;
    
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    
    handleInputChange('images', newImages);
  };
  
  // Move an image down in the array
  const moveImageDown = (index: number) => {
    if (index >= images.length - 1) return;
    
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    
    handleInputChange('images', newImages);
  };
  
  // Delete an image from the array
  const deleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    handleInputChange('images', newImages);
    
    // Clear editing mode if the deleted image was being edited
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      // Adjust editingIndex if we deleted an image before it
      setEditingIndex(editingIndex - 1);
    }
  };
  
  // Update image properties
  const updateImageProperty = (index: number, property: string, value: string) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      [property]: value
    };
    handleInputChange('images', newImages);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {images.map((image, index) => (
          <Card key={index} className={`overflow-hidden ${editingIndex === index ? 'ring-2 ring-primary' : ''}`}>
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3 h-48 bg-muted relative">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {editingIndex === index ? (
                <div className="flex-1 p-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`image-alt-${index}`}>Image Caption/Title</Label>
                    <Input 
                      id={`image-alt-${index}`}
                      value={image.alt || ''}
                      onChange={(e) => updateImageProperty(index, 'alt', e.target.value)}
                      placeholder="Describe this image"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`image-caption-${index}`}>Detailed Caption</Label>
                    <Textarea 
                      id={`image-caption-${index}`}
                      value={image.caption || ''}
                      onChange={(e) => updateImageProperty(index, 'caption', e.target.value)}
                      placeholder="Add more details about this image (optional)"
                      rows={3}
                    />
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingIndex(null)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium truncate">
                      {image.alt || `Image ${index + 1}`}
                    </h3>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {image.caption}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => moveImageUp(index)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveImageDown(index)} disabled={index === images.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingIndex(index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteImage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryImagesSection;
