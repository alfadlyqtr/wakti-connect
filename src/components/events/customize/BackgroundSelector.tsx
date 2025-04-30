
import React, { useState, useEffect, useCallback } from "react";
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
      const tabType = backgroundType === 'solid' ? 'color' : backgroundType;
      setActiveTab(tabType);
    }
  }, [backgroundType]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    // Set a default value when changing tabs
    if (value === 'color') {
      onBackgroundChange('color', backgroundValue === '' ? '#ffffff' : backgroundValue);
    } else if (value === 'image') {
      if (!backgroundValue || (!backgroundValue.startsWith('data:') && !backgroundValue.startsWith('http'))) {
        onBackgroundChange('image', '');
      }
    }
  }, [backgroundValue, onBackgroundChange]);

  // Handler for color tab changes with strict event handling
  const handleColorChange = useCallback((value: string) => {
    onBackgroundChange('color', value);
  }, [onBackgroundChange]);

  // Handler for image tab changes with strict event handling
  const handleImageChange = useCallback((value: string) => {
    onBackgroundChange('image', value);
  }, [onBackgroundChange]);

  // AI background generation with explicit event control
  const handleGenerateAIBackground = useCallback((e: React.MouseEvent) => {
    // Prevent default and stop propagation on all levels
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    
    console.log("AI Background generation triggered with strict event control");
    
    // First make sure we're on the image tab
    if (activeTab !== 'image') {
      setActiveTab('image');
    }
    
    // Trigger generation with a slight delay to ensure tab change is complete
    setTimeout(() => {
      if (onGenerateAIBackground) {
        onGenerateAIBackground();
      } else {
        toast({
          title: "AI Background Generation",
          description: "This feature is not available yet."
        });
      }
    }, 50);
  }, [activeTab, onGenerateAIBackground]);

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
        className="w-full relative"
      >
        <TabsList 
          className="grid grid-cols-2 w-full"
          onClick={stopPropagation}
        >
          <TabsTrigger 
            value="color" 
            onClick={(e) => {
              stopPropagation(e);
              handleTabChange('color');
            }}
          >
            Solid Color
          </TabsTrigger>
          <TabsTrigger 
            value="image" 
            onClick={(e) => {
              stopPropagation(e);
              handleTabChange('image');
            }}
          >
            Image
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4">
          <ColorTab 
            value={backgroundType === 'color' || backgroundType === 'solid' ? backgroundValue : '#ffffff'} 
            onChange={handleColorChange} 
          />
        </TabsContent>
        
        <TabsContent value="image" className="pt-4">
          <ImageTab 
            value={backgroundType === 'image' ? backgroundValue : ''} 
            onChange={handleImageChange}
            title={title}
            description={description}
          />
          
          <div 
            className="mt-4 border-t pt-4"
            onClick={stopPropagation}
            onMouseDown={stopPropagation}
            onPointerDown={stopPropagation}
          >
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleGenerateAIBackground(e);
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackgroundSelector;
