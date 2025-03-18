
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImagePlus } from "lucide-react";
import { EventCustomization } from "@/types/event.types";
import BackgroundSelector from "./BackgroundSelector";
import ButtonStyleSelector from "./ButtonStyleSelector";
import FontSelector from "./FontSelector";
import HeaderStyleSelector from "./HeaderStyleSelector";

interface CreateFromScratchFormProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}

const CreateFromScratchForm: React.FC<CreateFromScratchFormProps> = ({
  customization,
  onCustomizationChange
}) => {
  const [activeTab, setActiveTab] = useState("background");
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(customization.headerImage || null);
  
  const handleBackgroundChange = (type: 'color' | 'gradient' | 'image', value: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        type,
        value
      }
    });
  };
  
  const handleButtonStyleChange = (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => {
    onCustomizationChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [type]: {
          ...customization.buttons[type],
          [property]: value
        }
      }
    });
  };
  
  const handleFontChange = (property: 'family' | 'size' | 'color', value: string) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleHeaderStyleChange = (style: 'banner' | 'simple' | 'minimal') => {
    onCustomizationChange({
      ...customization,
      headerStyle: style
    });
  };
  
  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setHeaderImagePreview(imageUrl);
        onCustomizationChange({
          ...customization,
          headerImage: imageUrl
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleToggleChatbot = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableChatbot: checked
    });
  };
  
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: checked
    });
  };
  
  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <BackgroundSelector 
            backgroundType={customization.background.type}
            backgroundValue={customization.background.value}
            onBackgroundChange={handleBackgroundChange}
          />

          <div className="mt-6">
            <Label className="block mb-2">Animation</Label>
            <div className="grid grid-cols-3 gap-3">
              {['fade', 'slide', 'pop'].map((animation) => (
                <div 
                  key={animation}
                  className={`border p-2 rounded-md cursor-pointer transition-all ${
                    customization.animation === animation ? 'border-primary shadow-sm' : 'border-border'
                  }`}
                  onClick={() => handleAnimationChange(animation as 'fade' | 'slide' | 'pop')}
                >
                  <div className={`aspect-video bg-muted/50 flex items-center justify-center text-sm font-medium capitalize ${
                    animation === 'fade' ? 'animate-fade-in' :
                    animation === 'slide' ? 'animate-slide-in-right' :
                    animation === 'pop' ? 'animate-scale-in' : ''
                  }`}>
                    {animation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <FontSelector 
            font={customization.font}
            onFontChange={handleFontChange}
          />
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-4">
          <ButtonStyleSelector 
            acceptButton={customization.buttons.accept}
            declineButton={customization.buttons.decline}
            onButtonStyleChange={handleButtonStyleChange}
          />
        </TabsContent>
        
        <TabsContent value="header" className="space-y-6">
          <HeaderStyleSelector
            value={customization.headerStyle}
            onChange={handleHeaderStyleChange}
          />
          
          <div className="mt-6">
            <Label className="block mb-2">Header Image</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
              <input
                type="file"
                id="headerImage"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleHeaderImageUpload}
                className="hidden"
              />
              <Label htmlFor="headerImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Upload Image (Max 2MB)</span>
                <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
              </Label>
              {headerImagePreview && (
                <div className="mt-4">
                  <img 
                    src={headerImagePreview} 
                    alt="Header image preview" 
                    className="mx-auto max-h-32 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableChatbot" className="font-medium">Enable TMW Chatbot</Label>
              <p className="text-sm text-muted-foreground">Allow attendees to ask questions about your event</p>
            </div>
            <Switch 
              id="enableChatbot" 
              checked={customization.enableChatbot || false}
              onCheckedChange={handleToggleChatbot}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableCalendar" className="font-medium">WAKTI Calendar Integration</Label>
              <p className="text-sm text-muted-foreground">Add "Add to WAKTI Calendar" button</p>
            </div>
            <Switch 
              id="enableCalendar" 
              checked={customization.enableAddToCalendar || false}
              onCheckedChange={handleToggleCalendar}
            />
          </div>
          
          <div className="p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
            <p>All events include a small "Powered by WAKTI" badge for brand visibility.</p>
          </div>
          
          <div className="mt-4">
            <Label className="block mb-2">Business Branding</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="businessLogo" className="text-sm">Logo URL</Label>
                <Input 
                  id="businessLogo"
                  value={customization.branding?.logo || ''}
                  onChange={(e) => onCustomizationChange({
                    ...customization,
                    branding: {
                      ...customization.branding || {},
                      logo: e.target.value
                    }
                  })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="businessSlogan" className="text-sm">Slogan</Label>
                <Input 
                  id="businessSlogan"
                  value={customization.branding?.slogan || ''}
                  onChange={(e) => onCustomizationChange({
                    ...customization,
                    branding: {
                      ...customization.branding || {},
                      slogan: e.target.value
                    }
                  })}
                  placeholder="Your business slogan"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateFromScratchForm;
