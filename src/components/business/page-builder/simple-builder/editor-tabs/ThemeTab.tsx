
import React from "react";
import { PageSettings, TextAlignment } from "../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TwitterPicker } from 'react-color';

interface ThemeTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({ pageSettings, setPageSettings }) => {
  const updateSettings = (key: keyof PageSettings, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };
  
  const handleColorChange = (key: keyof PageSettings, color: any) => {
    updateSettings(key, color.hex);
  };
  
  const fontFamilyOptions = [
    { value: "Inter, sans-serif", label: "Inter (Sans-serif)" },
    { value: "Georgia, serif", label: "Georgia (Serif)" },
    { value: "Courier New, monospace", label: "Courier New (Monospace)" },
    { value: "Arial, sans-serif", label: "Arial (Sans-serif)" },
    { value: "Times New Roman, serif", label: "Times New Roman (Serif)" }
  ];
  
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label className="mb-2 block">Primary Color</Label>
            <TwitterPicker 
              color={pageSettings.primaryColor}
              onChangeComplete={(color) => handleColorChange('primaryColor', color)}
              triangle="hide"
              width="100%"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Secondary Color</Label>
            <TwitterPicker 
              color={pageSettings.secondaryColor}
              onChangeComplete={(color) => handleColorChange('secondaryColor', color)}
              triangle="hide"
              width="100%"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Background Color</Label>
            <TwitterPicker 
              color={pageSettings.backgroundColor}
              onChangeComplete={(color) => handleColorChange('backgroundColor', color)}
              triangle="hide"
              width="100%"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Text Color</Label>
            <TwitterPicker 
              color={pageSettings.textColor}
              onChangeComplete={(color) => handleColorChange('textColor', color)}
              triangle="hide"
              width="100%"
            />
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select
              value={pageSettings.fontFamily}
              onValueChange={(value) => updateSettings('fontFamily', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="headingStyle">Heading Style</Label>
            <Select
              value={pageSettings.headingStyle || 'default'}
              onValueChange={(value) => updateSettings('headingStyle', value)}
            >
              <SelectTrigger className="mt-1">
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
          
          <div>
            <Label>Text Alignment</Label>
            <div className="flex mt-2 space-x-2">
              <Button
                type="button"
                variant={pageSettings.textAlignment === 'left' ? "default" : "outline"}
                className="flex-1"
                onClick={() => updateSettings('textAlignment', 'left' as TextAlignment)}
              >
                Left
              </Button>
              <Button
                type="button"
                variant={pageSettings.textAlignment === 'center' ? "default" : "outline"}
                className="flex-1"
                onClick={() => updateSettings('textAlignment', 'center' as TextAlignment)}
              >
                Center
              </Button>
              <Button
                type="button"
                variant={pageSettings.textAlignment === 'right' ? "default" : "outline"}
                className="flex-1"
                onClick={() => updateSettings('textAlignment', 'right' as TextAlignment)}
              >
                Right
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select
              value={pageSettings.buttonStyle || 'default'}
              onValueChange={(value) => updateSettings('buttonStyle', value)}
            >
              <SelectTrigger className="mt-1">
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
          
          <div>
            <Label htmlFor="sectionSpacing">Section Spacing</Label>
            <Select
              value={pageSettings.sectionSpacing || 'default'}
              onValueChange={(value) => updateSettings('sectionSpacing', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select section spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contentMaxWidth">Content Max Width</Label>
            <Select
              value={pageSettings.contentMaxWidth || '1200px'}
              onValueChange={(value) => updateSettings('contentMaxWidth', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select content width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800px">Narrow (800px)</SelectItem>
                <SelectItem value="1000px">Medium (1000px)</SelectItem>
                <SelectItem value="1200px">Wide (1200px)</SelectItem>
                <SelectItem value="1440px">Extra Wide (1440px)</SelectItem>
                <SelectItem value="100%">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTab;
