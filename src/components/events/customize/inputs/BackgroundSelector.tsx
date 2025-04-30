
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventSafeColorPicker } from "./EventSafeColorPicker";
import { Sparkles, ImageIcon, Loader2 } from "lucide-react";
import { generateEventBackground } from "@/hooks/ai/utils/eventBackgroundGenerator";
import { toast } from "@/components/ui/use-toast";

// Color presets for the event backgrounds
const COLOR_PRESETS = [
  // Whites and Light Grays
  "#ffffff", "#f8f9fa", "#e9ecef", 
  // Gray and Dark tones
  "#6c757d", "#495057", "#212529", 
  // Gradient-friendly colors
  "#f8d7da", "#f44336", "#d1e7dd", 
  "#4caf50", "#cff4fc", "#03a9f4",
  "#fff3cd", "#ffc107", "#d0d0f0",
  "#3f51b5", "#9c27b0", "#9b87f5"
];

interface ImageTabProps {
  value: string;
  onChange: (value: string) => void;
  onAIGenerate: () => void;
  isGenerating: boolean;
}

const ImageTab: React.FC<ImageTabProps> = ({ 
  value, 
  onChange, 
  onAIGenerate,
  isGenerating
}) => {
  const [imageUrl, setImageUrl] = useState(value);
  
  useEffect(() => {
    setImageUrl(value);
  }, [value]);
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setImageUrl(e.target.value);
  };
  
  const handleApplyUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(imageUrl);
  };
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (fileEvent) => {
        if (fileEvent.target?.result) {
          const imageData = fileEvent.target.result.toString();
          onChange(imageData);
          setImageUrl(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle event propagation carefully for all interactions
  const stopPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  return (
    <div 
      className="space-y-4" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
    >
      {/* Image URL Input */}
      <form onSubmit={handleApplyUrl}>
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={handleImageUrlChange}
            className="col-span-3"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          />
          <Button 
            type="submit"
            variant="secondary"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            Apply
          </Button>
        </div>
      </form>
      
      {/* Image Preview */}
      {value && (
        <div className="rounded-md overflow-hidden border aspect-video bg-muted">
          <img 
            src={value} 
            alt="Background preview" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image-upload" className="text-sm">Upload Image</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          onMouseDown={stopPropagation}
          onClick={stopPropagation}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Maximum file size: 5MB
        </p>
      </div>
      
      {/* AI Background Generation */}
      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAIGenerate();
          }}
          disabled={isGenerating}
          type="button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI Background
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Create a unique background based on your event details
        </p>
      </div>
    </div>
  );
};

interface BackgroundSelectorProps {
  backgroundType: 'solid' | 'image';
  backgroundValue: string;
  onBackgroundChange: (type: 'solid' | 'image', value: string) => void;
  title?: string;
  description?: string;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
  title,
  description
}) => {
  const [activeTab, setActiveTab] = useState<string>(backgroundType || 'solid');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Update active tab when backgroundType changes
  useEffect(() => {
    const tabType = backgroundType === 'solid' ? 'solid' : 'image';
    setActiveTab(tabType);
  }, [backgroundType]);
  
  // Handler for tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    // Set default values when changing tabs
    if (value === 'solid' && backgroundType !== 'solid') {
      onBackgroundChange('solid', backgroundValue === '' ? '#ffffff' : backgroundValue);
    } else if (value === 'image' && backgroundType !== 'image') {
      onBackgroundChange('image', '');
    }
  }, [backgroundType, backgroundValue, onBackgroundChange]);
  
  // Handler for color changes
  const handleColorChange = useCallback((value: string) => {
    onBackgroundChange('solid', value);
  }, [onBackgroundChange]);
  
  // Handler for image changes
  const handleImageChange = useCallback((value: string) => {
    onBackgroundChange('image', value);
  }, [onBackgroundChange]);
  
  // Handler for AI background generation
  const handleGenerateAIBackground = useCallback(async () => {
    if (!title && !description) {
      toast({
        title: "Missing information",
        description: "Please add a title or description to generate a relevant background",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      toast({
        title: "Generating background",
        description: "Please wait while we create a background for your event..."
      });
      
      const result = await generateEventBackground(title || '', description || '');
      
      if (result.success && result.imageUrl) {
        handleImageChange(result.imageUrl);
        toast({
          title: "Background generated",
          description: "Your AI generated background has been applied"
        });
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("AI background generation failed:", error);
      
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate image background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [title, description, handleImageChange]);
  
  // Universal event stopper
  const stopPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return (
    <div 
      className="space-y-4" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <Label>Background</Label>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList 
          className="grid grid-cols-2 w-full"
          onClick={stopPropagation}
        >
          <TabsTrigger 
            value="solid" 
            onClick={stopPropagation}
          >
            Solid Color
          </TabsTrigger>
          <TabsTrigger 
            value="image" 
            onClick={stopPropagation}
          >
            Image
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="solid" 
          className="pt-4"
          onClick={stopPropagation}
        >
          <EventSafeColorPicker 
            value={backgroundType === 'solid' ? backgroundValue : '#ffffff'} 
            onChange={handleColorChange}
            presets={COLOR_PRESETS}
          />
        </TabsContent>
        
        <TabsContent 
          value="image" 
          className="pt-4"
          onClick={stopPropagation}
        >
          <ImageTab 
            value={backgroundType === 'image' ? backgroundValue : ''} 
            onChange={handleImageChange}
            onAIGenerate={handleGenerateAIBackground}
            isGenerating={isGenerating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
