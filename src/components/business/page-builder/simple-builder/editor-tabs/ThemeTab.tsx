
import React from "react";
import { PageSettings } from "../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Font options with preview styles
const fontOptions = [
  { value: "Inter", label: "Inter", style: { fontFamily: "Inter, sans-serif" } },
  { value: "Playfair Display", label: "Playfair Display", style: { fontFamily: "'Playfair Display', serif" } },
  { value: "Red Rose", label: "Red Rose", style: { fontFamily: "'Red Rose', sans-serif" } },
  { value: "Cairo", label: "Cairo", style: { fontFamily: "'Cairo', sans-serif" } },
  { value: "Arial", label: "Arial", style: { fontFamily: "Arial, sans-serif" } },
  { value: "Verdana", label: "Verdana", style: { fontFamily: "Verdana, sans-serif" } },
  { value: "Georgia", label: "Georgia", style: { fontFamily: "Georgia, serif" } },
  { value: "Times New Roman", label: "Times New Roman", style: { fontFamily: "'Times New Roman', serif" } }
];

// Common text colors with labels
const textColorPresets = [
  { value: "#000000", label: "Black" },
  { value: "#333333", label: "Dark Gray" },
  { value: "#666666", label: "Medium Gray" },
  { value: "#777777", label: "Gray" },
  { value: "#FFFFFF", label: "White" },
  { value: "#4f46e5", label: "Indigo" },
  { value: "#10b981", label: "Emerald" },
  { value: "#ef4444", label: "Red" }
];

interface ThemeTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({ pageSettings, setPageSettings }) => {
  const updateSettings = (key: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors">
        <TabsList className="w-full">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <ColorInput
              id="primaryColor"
              value={pageSettings.primaryColor}
              onChange={(value) => updateSettings('primaryColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <ColorInput
              id="secondaryColor"
              value={pageSettings.secondaryColor}
              onChange={(value) => updateSettings('secondaryColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <ColorInput
              id="backgroundColor"
              value={pageSettings.backgroundColor || "#ffffff"}
              onChange={(value) => updateSettings('backgroundColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <ColorInput
              id="textColor"
              value={pageSettings.textColor || "#000000"}
              onChange={(value) => updateSettings('textColor', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Text Color Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {textColorPresets.map((color) => (
                <Button
                  key={color.value}
                  type="button"
                  variant="outline"
                  className="h-8 w-full p-0"
                  style={{ 
                    backgroundColor: color.value,
                    borderColor: color.value === "#FFFFFF" ? "#e5e7eb" : color.value
                  }}
                  title={color.label}
                  onClick={() => updateSettings('textColor', color.value)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select
              value={pageSettings.fontFamily}
              onValueChange={(value) => updateSettings('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    style={font.style}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Font preview */}
            {pageSettings.fontFamily && (
              <div 
                className="mt-3 p-3 border rounded"
                style={{ fontFamily: pageSettings.fontFamily }}
              >
                <p className="text-sm">Regular text in {pageSettings.fontFamily}</p>
                <p className="text-base">Base size text</p>
                <p className="text-lg">Large text</p>
                <p className="text-xl font-bold">Bold heading</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Default Text Alignment</Label>
            <div className="flex space-x-2">
              <Button 
                type="button"
                size="sm"
                variant={pageSettings.textAlignment === 'left' ? 'default' : 'outline'}
                onClick={() => updateSettings('textAlignment', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={pageSettings.textAlignment === 'center' ? 'default' : 'outline'}
                onClick={() => updateSettings('textAlignment', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={pageSettings.textAlignment === 'right' ? 'default' : 'outline'}
                onClick={() => updateSettings('textAlignment', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headingStyle">Heading Style</Label>
            <Select 
              value={pageSettings.headingStyle || 'default'}
              onValueChange={(value) => updateSettings('headingStyle', value)}
            >
              <SelectTrigger id="headingStyle">
                <SelectValue placeholder="Select heading style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="sectionSpacing">Section Spacing</Label>
            <Select 
              value={pageSettings.sectionSpacing || 'default'}
              onValueChange={(value) => updateSettings('sectionSpacing', value)}
            >
              <SelectTrigger id="sectionSpacing">
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
              value={pageSettings.contentMaxWidth || 'default'}
              onValueChange={(value) => updateSettings('contentMaxWidth', value)}
            >
              <SelectTrigger id="contentMaxWidth">
                <SelectValue placeholder="Select content width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Narrow</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buttonStyle">Button Style</Label>
            <Select 
              value={pageSettings.buttonStyle || 'default'}
              onValueChange={(value) => updateSettings('buttonStyle', value)}
            >
              <SelectTrigger id="buttonStyle">
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="bg-gray-50 rounded-md p-3">
        <p className="text-sm text-muted-foreground">
          Theme settings apply across your entire page. To style individual sections, select a section and use the section styling options.
        </p>
      </div>
    </div>
  );
};

export default ThemeTab;
