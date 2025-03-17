
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  MapPin, 
  RotateCcw 
} from "lucide-react";
import { InvitationCustomization } from "@/types/invitation.types";

interface CustomizationPanelProps {
  customization: Partial<InvitationCustomization>;
  onChange: (updates: Partial<InvitationCustomization>) => void;
  onReset: () => void;
}

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Playfair Display', label: 'Playfair' },
  { value: 'Montserrat', label: 'Montserrat' }
];

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
  onReset
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customize Invitation</h3>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1.5"
          onClick={onReset}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
      </div>
      
      <Tabs defaultValue="style">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="style" className="flex items-center gap-1.5">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Style</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1.5">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-1.5">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-1.5">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="space-y-4">
          {/* Background Type */}
          <div className="space-y-2">
            <Label>Background Type</Label>
            <RadioGroup
              value={customization.backgroundType || 'solid'}
              onValueChange={(value) => onChange({ backgroundType: value as 'solid' | 'gradient' | 'image' })}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="bg-solid" />
                <Label htmlFor="bg-solid">Solid Color</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="bg-gradient" />
                <Label htmlFor="bg-gradient">Gradient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="bg-image" />
                <Label htmlFor="bg-image">Image</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Background Value */}
          {customization.backgroundType === 'solid' && (
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: customization.backgroundValue || '#ffffff' }}
                />
                <Input
                  id="bg-color"
                  type="color"
                  value={customization.backgroundValue || '#ffffff'}
                  onChange={(e) => onChange({ backgroundValue: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          {customization.backgroundType === 'gradient' && (
            <div className="space-y-2">
              <Label htmlFor="bg-gradient">Gradient</Label>
              <select
                id="bg-gradient"
                value={customization.backgroundValue}
                onChange={(e) => onChange({ backgroundValue: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">Purple Gradient</option>
                <option value="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">Green Gradient</option>
                <option value="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">Pink Gradient</option>
                <option value="linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)">Teal Gradient</option>
                <option value="linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)">Orange Purple</option>
              </select>
              <div
                className="w-full h-8 mt-1 rounded-md"
                style={{ background: customization.backgroundValue }}
              />
            </div>
          )}
          
          {customization.backgroundType === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="bg-image-url">Image URL</Label>
              <Input
                id="bg-image-url"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={customization.backgroundValue || ''}
                onChange={(e) => onChange({ backgroundValue: e.target.value })}
              />
              {customization.backgroundValue && (
                <div 
                  className="w-full h-24 mt-1 rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${customization.backgroundValue})` }}
                />
              )}
            </div>
          )}
          
          {/* Button Styles */}
          <div className="space-y-4 border-t pt-4 mt-4">
            <h4 className="text-sm font-medium">Button Styles</h4>
            
            {/* Accept Button */}
            <div className="space-y-2">
              <Label htmlFor="accept-button-color">Accept Button</Label>
              <div className="flex gap-2">
                <Input
                  id="accept-button-color"
                  type="color"
                  value={customization.buttonStyles?.accept?.background || '#4CAF50'}
                  onChange={(e) => onChange({
                    buttonStyles: {
                      ...customization.buttonStyles,
                      accept: {
                        ...customization.buttonStyles?.accept,
                        background: e.target.value
                      }
                    }
                  })}
                  className="w-1/2"
                />
                <Input
                  type="color"
                  value={customization.buttonStyles?.accept?.color || '#ffffff'}
                  onChange={(e) => onChange({
                    buttonStyles: {
                      ...customization.buttonStyles,
                      accept: {
                        ...customization.buttonStyles?.accept,
                        color: e.target.value
                      }
                    }
                  })}
                  className="w-1/2"
                />
              </div>
            </div>
            
            {/* Decline Button */}
            <div className="space-y-2">
              <Label htmlFor="decline-button-color">Decline Button</Label>
              <div className="flex gap-2">
                <Input
                  id="decline-button-color"
                  type="color"
                  value={customization.buttonStyles?.decline?.background || '#f44336'}
                  onChange={(e) => onChange({
                    buttonStyles: {
                      ...customization.buttonStyles,
                      decline: {
                        ...customization.buttonStyles?.decline,
                        background: e.target.value
                      }
                    }
                  })}
                  className="w-1/2"
                />
                <Input
                  type="color"
                  value={customization.buttonStyles?.decline?.color || '#ffffff'}
                  onChange={(e) => onChange({
                    buttonStyles: {
                      ...customization.buttonStyles,
                      decline: {
                        ...customization.buttonStyles?.decline,
                        color: e.target.value
                      }
                    }
                  })}
                  className="w-1/2"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          {/* Font Family */}
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <select
              id="font-family"
              value={customization.fontFamily || 'Inter'}
              onChange={(e) => onChange({ fontFamily: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value}>{font.label}</option>
              ))}
            </select>
          </div>
          
          {/* Font Size */}
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <RadioGroup
              value={customization.fontSize || 'medium'}
              onValueChange={(value) => onChange({ fontSize: value as 'small' | 'medium' | 'large' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small" className="text-xs">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium" className="text-sm">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="text-base">Large</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Text Alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex bg-muted rounded-md p-1">
              <Button
                type="button"
                variant={customization.textAlign === 'left' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => onChange({ textAlign: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={customization.textAlign === 'center' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => onChange({ textAlign: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={customization.textAlign === 'right' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => onChange({ textAlign: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          {/* Layout Size */}
          <div className="space-y-2">
            <Label>Card Size</Label>
            <RadioGroup
              value={customization.layoutSize || 'medium'}
              onValueChange={(value) => onChange({ layoutSize: value as 'small' | 'medium' | 'large' })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="layout-small" />
                <Label htmlFor="layout-small">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="layout-medium" />
                <Label htmlFor="layout-medium">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="layout-large" />
                <Label htmlFor="layout-large">Spacious</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Shadow Effect */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="shadow-effect">Shadow Effect</Label>
              <span className="text-xs text-muted-foreground">
                {customization.customEffects?.shadow ? 'On' : 'Off'}
              </span>
            </div>
            <div className="pt-2">
              <Slider
                id="shadow-effect"
                onValueChange={(value) => onChange({
                  customEffects: {
                    ...customization.customEffects,
                    shadow: value[0] > 0
                  }
                })}
                defaultValue={[customization.customEffects?.shadow ? 100 : 0]}
                max={100}
                step={100}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          {/* Header Image */}
          <div className="space-y-2">
            <Label htmlFor="header-image">Header Image URL</Label>
            <Input
              id="header-image"
              type="text"
              placeholder="https://example.com/banner.jpg"
              value={customization.headerImage || ''}
              onChange={(e) => onChange({ headerImage: e.target.value })}
            />
            {customization.headerImage && (
              <div 
                className="w-full h-24 mt-1 rounded-md bg-cover bg-center"
                style={{ backgroundImage: `url(${customization.headerImage})` }}
              />
            )}
          </div>
          
          {/* Map Location */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="map-location" className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Map Location</span>
            </Label>
            <Input
              id="map-location"
              type="text"
              placeholder="123 Main St, City, Country"
              value={customization.mapLocation || ''}
              onChange={(e) => onChange({ mapLocation: e.target.value })}
            />
            {customization.mapLocation && (
              <div className="rounded-md overflow-hidden mt-2 border">
                <iframe
                  title="Location Preview"
                  width="100%"
                  height="150"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(customization.mapLocation)}&output=embed`}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomizationPanel;
