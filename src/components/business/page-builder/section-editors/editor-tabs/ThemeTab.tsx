
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { PageSettings } from "../../simple-builder/types";

interface ThemeTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({ pageSettings, setPageSettings }) => {
  const handleInputChange = (field: keyof PageSettings, value: any) => {
    setPageSettings({
      ...pageSettings,
      [field]: value
    });
  };

  const handleContactInfoChange = (field: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      contactInfo: {
        ...pageSettings.contactInfo,
        [field]: value
      }
    });
  };

  const handleSocialLinkChange = (field: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      socialLinks: {
        ...pageSettings.socialLinks,
        [field]: value
      }
    });
  };

  const fontFamilyOptions = [
    { label: "Inter", value: "Inter" },
    { label: "Roboto", value: "Roboto" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Playfair Display", value: "Playfair Display" }
  ];

  const headingStyleOptions = [
    { label: "Default", value: "default" },
    { label: "Bold", value: "bold" },
    { label: "Elegant", value: "elegant" },
    { label: "Modern", value: "modern" }
  ];

  const buttonStyleOptions = [
    { label: "Default", value: "default" },
    { label: "Rounded", value: "rounded" },
    { label: "Outline", value: "outline" },
    { label: "Minimal", value: "minimal" }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="typography">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select 
              value={pageSettings.fontFamily || "Inter"} 
              onValueChange={(value) => handleInputChange("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilyOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="headingStyle">Heading Style</Label>
            <Select 
              value={pageSettings.headingStyle || "default"} 
              onValueChange={(value) => handleInputChange("headingStyle", value as PageSettings['headingStyle'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {headingStyleOptions.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex space-x-2">
              <Button 
                variant={pageSettings.textAlignment === 'left' ? 'default' : 'outline'}
                onClick={() => handleInputChange('textAlignment', 'left')}
                className="flex-1"
              >
                <AlignLeft className="mr-2 h-4 w-4" />
                Left
              </Button>
              <Button 
                variant={pageSettings.textAlignment === 'center' ? 'default' : 'outline'}
                onClick={() => handleInputChange('textAlignment', 'center')}
                className="flex-1"
              >
                <AlignCenter className="mr-2 h-4 w-4" />
                Center
              </Button>
              <Button 
                variant={pageSettings.textAlignment === 'right' ? 'default' : 'outline'}
                onClick={() => handleInputChange('textAlignment', 'right')}
                className="flex-1"
              >
                <AlignRight className="mr-2 h-4 w-4" />
                Right
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <ColorInput
              id="primaryColor"
              value={pageSettings.primaryColor}
              onChange={(value) => handleInputChange('primaryColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <ColorInput
              id="secondaryColor"
              value={pageSettings.secondaryColor || "#10b981"}
              onChange={(value) => handleInputChange('secondaryColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <ColorInput
              id="textColor"
              value={pageSettings.textColor || "#000000"}
              onChange={(value) => handleInputChange('textColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <ColorInput
              id="backgroundColor"
              value={pageSettings.backgroundColor || "#ffffff"}
              onChange={(value) => handleInputChange('backgroundColor', value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select 
              value={pageSettings.buttonStyle || "default"} 
              onValueChange={(value) => handleInputChange("buttonStyle", value as PageSettings['buttonStyle'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a button style" />
              </SelectTrigger>
              <SelectContent>
                {buttonStyleOptions.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sectionSpacing">Section Spacing</Label>
            <Select 
              value={pageSettings.sectionSpacing || "default"} 
              onValueChange={(value) => handleInputChange("sectionSpacing", value as PageSettings['sectionSpacing'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentMaxWidth">Content Width</Label>
            <Select 
              value={pageSettings.contentMaxWidth || "default"} 
              onValueChange={(value) => handleInputChange("contentMaxWidth", value as PageSettings['contentMaxWidth'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Narrow</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeTab;
