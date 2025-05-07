
import React from "react";
import { PageSettings } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Separator } from "@/components/ui/separator";
import { AlignCenter, AlignLeft, AlignRight, Upload } from "lucide-react";

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a reader to read the file
    const reader = new FileReader();

    // Define what happens on file load
    reader.onload = (event) => {
      const backgroundImage = event.target?.result as string;
      setPageSettings({
        ...pageSettings,
        backgroundImage
      });
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="typography" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4 pt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Font Family</h3>
            <Select
              value={pageSettings.fontFamily}
              onValueChange={(value) => updateSettings('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Lato">Lato</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Text Color</h3>
            <ColorInput
              value={pageSettings.textColor || "#000000"}
              onChange={(value) => updateSettings('textColor', value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Text Alignment</h3>
            <div className="flex space-x-2">
              <Button 
                variant={pageSettings.textAlignment === 'left' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => updateSettings('textAlignment', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant={pageSettings.textAlignment === 'center' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => updateSettings('textAlignment', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                variant={pageSettings.textAlignment === 'right' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => updateSettings('textAlignment', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Heading Style</h3>
            <Select
              value={pageSettings.headingStyle || "default"}
              onValueChange={(value) => updateSettings('headingStyle', value)}
            >
              <SelectTrigger>
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

        <TabsContent value="colors" className="space-y-4 pt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Primary Color</h3>
            <ColorInput
              value={pageSettings.primaryColor}
              onChange={(value) => updateSettings('primaryColor', value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Secondary Color</h3>
            <ColorInput
              value={pageSettings.secondaryColor}
              onChange={(value) => updateSettings('secondaryColor', value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Background Color</h3>
            <ColorInput
              value={pageSettings.backgroundColor || "#ffffff"}
              onChange={(value) => updateSettings('backgroundColor', value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Background Image</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  type="button"
                  onClick={() => document.getElementById('bg-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {pageSettings.backgroundImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateSettings('backgroundImage', undefined)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input 
                id="bg-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              {pageSettings.backgroundImage && (
                <div className="mt-2 border rounded-md p-2">
                  <img 
                    src={pageSettings.backgroundImage} 
                    alt="Background preview" 
                    className="h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 pt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Button Style</h3>
            <RadioGroup
              value={pageSettings.buttonStyle || "default"}
              onValueChange={(value) => updateSettings('buttonStyle', value)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="default" id="buttonStyle-default" />
                <Label htmlFor="buttonStyle-default">Default</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="rounded" id="buttonStyle-rounded" />
                <Label htmlFor="buttonStyle-rounded">Rounded</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="outline" id="buttonStyle-outline" />
                <Label htmlFor="buttonStyle-outline">Outline</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value="minimal" id="buttonStyle-minimal" />
                <Label htmlFor="buttonStyle-minimal">Minimal</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-sm font-medium mb-2">Section Spacing</h3>
            <Select
              value={pageSettings.sectionSpacing || "default"}
              onValueChange={(value) => updateSettings('sectionSpacing', value)}
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

          <div>
            <h3 className="text-sm font-medium mb-2">Content Width</h3>
            <Select
              value={pageSettings.contentMaxWidth || "default"}
              onValueChange={(value) => updateSettings('contentMaxWidth', value)}
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
