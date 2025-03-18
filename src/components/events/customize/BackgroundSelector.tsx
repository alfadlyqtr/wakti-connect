
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus } from "lucide-react";

interface BackgroundSelectorProps {
  backgroundType: string;
  backgroundValue: string;
  onBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  onBackgroundChange
}) => {
  const [activeTab, setActiveTab] = useState<string>(backgroundType || 'color');
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be less than 2MB");
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFileError("Only JPG, PNG and WebP images are allowed");
      return;
    }

    setFileError(null);

    // In a real implementation, this would upload to Supabase storage
    // For now, we'll create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onBackgroundChange('image', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Set a default value when changing tabs
    if (value === 'color') {
      onBackgroundChange('color', '#ffffff');
    } else if (value === 'gradient') {
      onBackgroundChange('gradient', 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)');
    }
  };

  return (
    <div className="space-y-4">
      <Label>Background</Label>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="color">Solid Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4">
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={backgroundType === 'color' ? backgroundValue : '#ffffff'}
              onChange={(e) => onBackgroundChange('color', e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input 
              type="text" 
              value={backgroundType === 'color' ? backgroundValue : '#ffffff'}
              onChange={(e) => onBackgroundChange('color', e.target.value)}
              className="flex-1"
              placeholder="#FFFFFF"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="gradient" className="pt-4">
          <RadioGroup 
            value={backgroundValue} 
            onValueChange={(value) => onBackgroundChange('gradient', value)}
            className="grid grid-cols-2 gap-2"
          >
            <div>
              <RadioGroupItem value="linear-gradient(90deg, #f6d365 0%, #fda085 100%)" id="gradient1" className="sr-only" />
              <Label htmlFor="gradient1" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #f6d365 0%, #fda085 100%)" }}></div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)" id="gradient2" className="sr-only" />
              <Label htmlFor="gradient2" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)" }}></div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)" id="gradient3" className="sr-only" />
              <Label htmlFor="gradient3" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)" }}></div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)" id="gradient4" className="sr-only" />
              <Label htmlFor="gradient4" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)" }}></div>
              </Label>
            </div>
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="image" className="pt-4">
          <div className="flex flex-col gap-2">
            <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
              <input
                type="file"
                id="backgroundImage"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Label htmlFor="backgroundImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Image (Max 2MB)</span>
                <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
              </Label>
              {backgroundType === 'image' && backgroundValue && (
                <div className="mt-4">
                  <img 
                    src={backgroundValue} 
                    alt="Background preview" 
                    className="mx-auto max-h-32 rounded-md object-cover"
                  />
                </div>
              )}
              {fileError && <p className="text-sm text-destructive mt-2">{fileError}</p>}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundSelector;
