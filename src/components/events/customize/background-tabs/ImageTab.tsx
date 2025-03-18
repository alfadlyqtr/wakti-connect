
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ImageTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageTab: React.FC<ImageTabProps> = ({
  value,
  onChange
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Sample background images
  const backgroundImages = [
    "https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1557682260-96773eb01377?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1528293519244-4e0acd3c9df6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1511300636408-a63a89df3482?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image under 2MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
        setSelectedPreset(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="block">Upload Your Own Image</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
          <input
            type="file"
            id="backgroundImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Label htmlFor="backgroundImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Background Image (Max 2MB)</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="block">Or Choose From Gallery</Label>
        <div className="grid grid-cols-2 gap-2">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`h-24 rounded-md border cursor-pointer overflow-hidden ${
                value === image || selectedPreset === image ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                onChange(image);
                setSelectedPreset(image);
              }}
            >
              <img src={image} alt={`Background ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {value && (
        <div className="mt-4">
          <Label className="block mb-2">Current Background Preview</Label>
          <div className="h-40 rounded-md border overflow-hidden">
            <img src={value} alt="Background preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageTab;
