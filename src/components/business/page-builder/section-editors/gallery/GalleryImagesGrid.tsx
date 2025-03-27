
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUp, ArrowDown, Edit2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface GalleryImagesGridProps {
  images: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GalleryImagesGrid: React.FC<GalleryImagesGridProps> = ({ 
  images, 
  handleInputChange 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<any>(null);
  
  // Open edit dialog for an image
  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setEditingImage({...images[index]});
    setDialogOpen(true);
  };
  
  // Save edited image
  const handleSaveImage = () => {
    if (editingIndex === null || !editingImage) return;
    
    const updatedImages = [...images];
    updatedImages[editingIndex] = editingImage;
    
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    setDialogOpen(false);
    setEditingIndex(null);
    setEditingImage(null);
  };
  
  // Delete an image
  const handleDeleteImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  // Move image position
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return; // Can't move past edges
    }
    
    const updatedImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap images
    [updatedImages[index], updatedImages[newIndex]] = 
      [updatedImages[newIndex], updatedImages[index]];
    
    handleInputChange({
      target: {
        name: 'images',
        value: updatedImages
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  return (
    <div className="space-y-4">
      <Label>Gallery Images ({images.length})</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img 
              src={image.url} 
              alt={image.alt || `Gallery image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md border"
            />
            
            {/* Image caption */}
            {image.caption && (
              <div className="text-xs truncate mt-1 text-muted-foreground">
                {image.caption}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                onClick={() => handleEditImage(index)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                onClick={() => handleMoveImage(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                onClick={() => handleMoveImage(index, 'down')}
                disabled={index === images.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleDeleteImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Image Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <img 
                  src={editingImage.url} 
                  alt={editingImage.alt} 
                  className="max-h-[200px] object-contain rounded-md"
                />
              </div>
              
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input 
                  id="alt" 
                  value={editingImage.alt || ""} 
                  onChange={(e) => setEditingImage({...editingImage, alt: e.target.value})}
                  placeholder="Image description for accessibility"
                />
              </div>
              
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea 
                  id="caption" 
                  value={editingImage.caption || ""} 
                  onChange={(e) => setEditingImage({...editingImage, caption: e.target.value})}
                  placeholder="Optional image caption"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="size">Image Size</Label>
                <div className="py-4">
                  <Slider
                    value={[editingImage.size || 100]}
                    min={50}
                    max={150}
                    step={5}
                    onValueChange={(value) => setEditingImage({...editingImage, size: value[0]})}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {editingImage.size || 100}% (50% to 150%)
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryImagesGrid;
