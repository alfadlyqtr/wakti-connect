
import React from "react";
import BackgroundSelector from "../BackgroundSelector";
import AnimationSelector from "../AnimationSelector";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

interface BackgroundTabProps {
  customization: EventCustomization;
  onAnimationChange: (value: 'fade' | 'slide' | 'pop') => void;
  onBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({
  customization,
  onAnimationChange,
  onBackgroundChange
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return;
    }

    // Create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onBackgroundChange('image', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <BackgroundSelector 
        backgroundType={customization.background.type}
        backgroundValue={customization.background.value}
        onBackgroundChange={onBackgroundChange}
      />

      <div className="space-y-2">
        <Label className="block">Header/Event Image</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
          <input
            type="file"
            id="eventImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Label htmlFor="eventImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Event Image (Max 2MB)</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
          </Label>
          {customization.headerImage && (
            <div className="mt-4">
              <img 
                src={customization.headerImage} 
                alt="Event image preview" 
                className="mx-auto max-h-32 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <AnimationSelector
        value={customization.animation}
        onChange={onAnimationChange}
      />
    </div>
  );
};

export default BackgroundTab;
