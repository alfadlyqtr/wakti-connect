
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ColorTab from "./background-tabs/ColorTab";
import ImageTab from "./background-tabs/ImageTab";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BackgroundSelectorProps {
  backgroundType: string;
  backgroundValue: string;
  onBackgroundChange: (type: 'color' | 'image', value: string) => void;
  onGenerateAIBackground?: (e?: React.MouseEvent) => void;
  title?: string;
  description?: string;
  isGenerating?: boolean;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  backgroundValue,
  onBackgroundChange,
  onGenerateAIBackground,
  title,
  description,
  isGenerating = false
}) => {
  const [activeTab, setActiveTab] = useState<string>(backgroundType || 'color');

  // Update active tab when backgroundType changes from parent
  useEffect(() => {
    if (backgroundType) {
      setActiveTab(backgroundType);
    }
  }, [backgroundType]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Set a default value when changing tabs
    if (value === 'color') {
      onBackgroundChange('color', '#ffffff');
    } else if (value === 'image' && !backgroundValue.startsWith('data:') && !backgroundValue.startsWith('http')) {
      onBackgroundChange('image', '');
    }
  };

  // Handler for color tab changes
  const handleColorChange = (value: string) => {
    onBackgroundChange('color', value);
  };

  // Handler for image tab changes
  const handleImageChange = (value: string) => {
    onBackgroundChange('image', value);
  };

  // Handler for AI background generation - improved to prevent click-through
  const handleGenerateAIBackground = (e: React.MouseEvent) => {
    // Prevent click-through by stopping event propagation
    e.preventDefault();
    e.stopPropagation();
    
    if (onGenerateAIBackground) {
      onGenerateAIBackground(e);
    } else {
      // Fallback implementation if no handler is provided
      toast({
        title: "AI Background Generation",
        description: "This feature is not available yet."
      });
    }
  };

  // This wrapper prevents click-through for the entire component
  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <Label onClick={(e) => e.stopPropagation()}>Background</Label>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <TabsList className="grid grid-cols-2 w-full" onClick={(e) => e.stopPropagation()}>
          <TabsTrigger value="color" onClick={(e) => e.stopPropagation()}>Solid Color</TabsTrigger>
          <TabsTrigger value="image" onClick={(e) => e.stopPropagation()}>Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4" onClick={(e) => e.stopPropagation()}>
          <ColorTab 
            value={backgroundType === 'color' ? backgroundValue : '#ffffff'} 
            onChange={handleColorChange} 
          />
        </TabsContent>
        
        <TabsContent value="image" className="pt-4" onClick={(e) => e.stopPropagation()}>
          <ImageTab 
            value={backgroundType === 'image' ? backgroundValue : ''} 
            onChange={handleImageChange}
            title={title}
            description={description}
          />
          
          <div 
            className="mt-4 border-t pt-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 relative z-50" 
              onClick={handleGenerateAIBackground}
              disabled={isGenerating}
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
            <p 
              className="text-xs text-muted-foreground mt-2 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              Create a unique background based on your event details
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundSelector;
