
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ColorInput } from "@/components/inputs/ColorInput";
import { PageSettings, TextAlignment, HeadingStyle, ButtonStyle, SectionSpacing } from "../types";

interface ThemeTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({ pageSettings, setPageSettings }) => {
  const handleColorChange = (property: keyof PageSettings, value: string) => {
    setPageSettings({
      ...pageSettings,
      [property]: value
    });
  };

  const handleSelectChange = (property: keyof PageSettings, value: string) => {
    setPageSettings({
      ...pageSettings,
      [property]: value
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <ColorInput 
              id="primaryColor" 
              value={pageSettings.primaryColor} 
              onChange={(color) => handleColorChange('primaryColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <ColorInput 
              id="secondaryColor" 
              value={pageSettings.secondaryColor} 
              onChange={(color) => handleColorChange('secondaryColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <ColorInput 
              id="backgroundColor" 
              value={pageSettings.backgroundColor} 
              onChange={(color) => handleColorChange('backgroundColor', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <ColorInput 
              id="textColor" 
              value={pageSettings.textColor} 
              onChange={(color) => handleColorChange('textColor', color)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select 
              value={pageSettings.fontFamily} 
              onValueChange={(value) => handleSelectChange('fontFamily', value)}
            >
              <SelectTrigger id="fontFamily" className="w-full">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans-serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textAlignment">Text Alignment</Label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${pageSettings.textAlignment === 'left' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'}`}
                onClick={() => handleSelectChange('textAlignment', 'left')}
              >
                Left
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${pageSettings.textAlignment === 'center' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'}`}
                onClick={() => handleSelectChange('textAlignment', 'center')}
              >
                Center
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${pageSettings.textAlignment === 'right' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'}`}
                onClick={() => handleSelectChange('textAlignment', 'right')}
              >
                Right
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="headingStyle">Heading Style</Label>
            <Select 
              value={pageSettings.headingStyle} 
              onValueChange={(value) => handleSelectChange('headingStyle', value as HeadingStyle)}
            >
              <SelectTrigger id="headingStyle" className="w-full">
                <SelectValue placeholder="Select heading style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Layout and Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionSpacing">Section Spacing</Label>
            <Select 
              value={pageSettings.sectionSpacing} 
              onValueChange={(value) => handleSelectChange('sectionSpacing', value as SectionSpacing)}
            >
              <SelectTrigger id="sectionSpacing" className="w-full">
                <SelectValue placeholder="Select section spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentMaxWidth">Content Max Width</Label>
            <Select
              value={pageSettings.contentMaxWidth || "1200px"}
              onValueChange={(value) => handleSelectChange('contentMaxWidth', value)}
            >
              <SelectTrigger id="contentMaxWidth" className="w-full">
                <SelectValue placeholder="Select content width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800px">Narrow (800px)</SelectItem>
                <SelectItem value="1000px">Medium (1000px)</SelectItem>
                <SelectItem value="1200px">Wide (1200px)</SelectItem>
                <SelectItem value="100%">Full Width (100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select 
              value={pageSettings.buttonStyle} 
              onValueChange={(value) => handleSelectChange('buttonStyle', value as ButtonStyle)}
            >
              <SelectTrigger id="buttonStyle" className="w-full">
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTab;
