
import React from "react";
import BackgroundSelector from "../BackgroundSelector";
import AnimationSelector from "../AnimationSelector";
import { EventCustomization } from "@/types/event.types";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface BackgroundTabProps {
  customization: EventCustomization;
  onAnimationChange: (value: 'fade' | 'slide' | 'pop') => void;
  onBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
  onBackgroundAngleChange?: (angle: number) => void;
  onBackgroundDirectionChange?: (direction: string) => void;
  onHeaderImageChange?: (imageUrl: string) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({
  customization,
  onAnimationChange,
  onBackgroundChange,
  onBackgroundAngleChange,
  onBackgroundDirectionChange,
  onHeaderImageChange
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isHeaderImage: boolean = false) => {
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
        if (isHeaderImage && onHeaderImageChange) {
          onHeaderImageChange(event.target.result as string);
          toast({
            title: "Header image uploaded",
            description: "The image has been set as your event header",
            variant: "success"
          });
        } else {
          onBackgroundChange('image', event.target.result as string);
          toast({
            title: "Background image uploaded",
            description: "The image has been set as your event background",
            variant: "success"
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <BackgroundSelector 
        backgroundType={customization.background.type}
        backgroundValue={customization.background.value}
        backgroundAngle={customization.background.angle}
        backgroundDirection={customization.background.direction}
        onBackgroundChange={onBackgroundChange}
        onBackgroundAngleChange={onBackgroundAngleChange}
        onBackgroundDirectionChange={onBackgroundDirectionChange}
      />

      <Separator className="my-6" />

      <div className="space-y-3">
        <Label className="block text-base">Header/Event Image</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
          <input
            type="file"
            id="eventImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageUpload(e, true)}
            className="hidden"
          />
          <Label htmlFor="eventImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Event Image (Max 2MB)</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
          </Label>
          {customization.headerImage && (
            <div className="mt-4 relative">
              <img 
                src={customization.headerImage} 
                alt="Event image preview" 
                className="mx-auto max-h-32 rounded-md object-cover"
              />
              <Button 
                variant="destructive" 
                size="sm" 
                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                onClick={() => onHeaderImageChange && onHeaderImageChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <AnimationSelector
        value={customization.animation}
        onChange={onAnimationChange}
      />
    </div>
  );
};

export default BackgroundTab;
