
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

  // Improved AI background generation handler with guaranteed event capturing
  const handleGenerateAIBackground = () => {
    console.log("Generating AI background...");
    
    // Make sure to activate the image tab first
    if (activeTab !== 'image') {
      setActiveTab('image');
      
      // Allow tab change to complete before triggering generation
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
    } else {
      if (onGenerateAIBackground) {
        onGenerateAIBackground();
      } else {
        toast({
          title: "AI Background Generation",
          description: "This feature is not available yet."
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label>Background</Label>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full relative"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="color">
            Solid Color
          </TabsTrigger>
          <TabsTrigger value="image">
            Image
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="color" className="pt-4">
          <ColorTab 
            value={backgroundType === 'color' ? backgroundValue : '#ffffff'} 
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
          
          <div className="mt-4 border-t pt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGenerateAIBackground}
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
