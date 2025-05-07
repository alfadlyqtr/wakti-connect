
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, GripVertical, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface GalleryImagesSectionProps {
  images: any[];
  handleInputChange: (name: string, value: any) => void;
}

const GalleryImagesSection: React.FC<GalleryImagesSectionProps> = ({
  images,
  handleInputChange
}) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;
    
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the images
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    
    handleInputChange('images', newImages);
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    handleInputChange('images', newImages);
    
    // Clear editing state if the removed image was being edited
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      // Adjust editing index if a preceding image was removed
      setEditingIndex(editingIndex - 1);
    }
  };
  
  const handleUpdateImageDetails = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      [field]: value
    };
    handleInputChange('images', newImages);
  };
  
  return (
    <div className="space-y-4">
      <Label>Gallery Images</Label>
      
      {images.length === 0 ? (
        <div className="text-center border border-dashed rounded-md p-4">
          <p className="text-sm text-muted-foreground">No images in gallery yet</p>
          <p className="text-xs text-muted-foreground mt-1">Go to the Upload tab to add images</p>
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {editingIndex === index ? (
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-[80px_1fr] gap-3 items-center">
                      <img 
                        src={image.url} 
                        alt={image.alt || `Gallery image ${index+1}`}
                        className="w-20 h-20 object-cover rounded" 
                      />
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`image-alt-${index}`} className="text-xs">Alt Text</Label>
                          <Input
                            id={`image-alt-${index}`}
                            value={image.alt || ""}
                            onChange={(e) => handleUpdateImageDetails(index, 'alt', e.target.value)}
                            placeholder="Image description"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`image-caption-${index}`} className="text-xs">Caption</Label>
                      <Textarea
                        id={`image-caption-${index}`}
                        value={image.caption || ""}
                        onChange={(e) => handleUpdateImageDetails(index, 'caption', e.target.value)}
                        placeholder="Image caption (optional)"
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingIndex(null)}
                      >
                        Done
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="p-2 text-gray-400">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 p-2">
                      <img 
                        src={image.url} 
                        alt={image.alt || `Gallery image ${index+1}`}
                        className="w-12 h-12 object-cover rounded" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {image.alt || `Image ${index+1}`}
                        </p>
                        {image.caption && (
                          <p className="text-xs text-gray-500 truncate">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center p-2 gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        disabled={index === 0}
                        onClick={() => handleMoveImage(index, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        disabled={index === images.length - 1}
                        onClick={() => handleMoveImage(index, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setEditingIndex(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryImagesSection;
