
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorInput } from "@/components/inputs/ColorInput";

interface AppearanceSettingsTabProps {
  pageData: {
    primary_color: string;
    secondary_color: string;
    page_pattern?: string;
    text_color?: string;
    font_family?: string;
    border_radius?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave
}) => {
  // Helper function to handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // Create a synthetic event to update the property
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Helper function to handle color changes
  const handleColorChange = (name: string, value: string) => {
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Tabs defaultValue="colors">
      <TabsList className="mb-4">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="typography">Typography</TabsTrigger>
        <TabsTrigger value="patterns">Patterns & Styles</TabsTrigger>
      </TabsList>
      
      <TabsContent value="colors" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>
              Customize the colors used in your business page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="primary_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="secondary_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="text_color"
                    name="text_color"
                    type="color"
                    value={pageData.text_color || '#000000'}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.text_color || '#000000'}
                    onChange={handleInputChangeWithAutoSave}
                    name="text_color"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg border">
              <div className="text-center">
                <h3 className="font-medium mb-2">Preview</h3>
                <div 
                  className="h-20 rounded-md flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${pageData.primary_color} 0%, ${pageData.secondary_color} 100%)`,
                    color: pageData.text_color || '#000000'
                  }}
                >
                  <span className="font-medium">Color Scheme Preview</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="typography" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Typography Settings</CardTitle>
            <CardDescription>
              Customize the fonts and text styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="font_family">Font Family</Label>
                <Select 
                  value={pageData.font_family || 'sans-serif'} 
                  onValueChange={(value) => handleSelectChange('font_family', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="cairo">Cairo</SelectItem>
                    <SelectItem value="redrose">Red Rose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Font Preview</h3>
                  <p className={`font-${pageData.font_family || 'sans-serif'} text-lg`}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className={`font-${pageData.font_family || 'sans-serif'} text-sm mt-2`}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="patterns" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Visual Patterns & Styles</CardTitle>
            <CardDescription>
              Customize the visual elements of your page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="border_radius">Border Radius</Label>
                <Select 
                  value={pageData.border_radius || 'medium'} 
                  onValueChange={(value) => handleSelectChange('border_radius', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (0px)</SelectItem>
                    <SelectItem value="small">Small (4px)</SelectItem>
                    <SelectItem value="medium">Medium (8px)</SelectItem>
                    <SelectItem value="large">Large (12px)</SelectItem>
                    <SelectItem value="full">Full (9999px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="page_pattern">Background Pattern</Label>
                <Select 
                  value={pageData.page_pattern || 'none'} 
                  onValueChange={(value) => handleSelectChange('page_pattern', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Style Preview</h3>
                  <div 
                    className="h-20 rounded-md flex items-center justify-center"
                    style={{ 
                      borderRadius: 
                        pageData.border_radius === 'none' ? '0px' :
                        pageData.border_radius === 'small' ? '4px' :
                        pageData.border_radius === 'medium' ? '8px' :
                        pageData.border_radius === 'large' ? '12px' :
                        pageData.border_radius === 'full' ? '9999px' : '8px',
                      backgroundImage: 
                        pageData.page_pattern === 'dots' ? 'radial-gradient(#00000022 1px, transparent 1px)' :
                        pageData.page_pattern === 'grid' ? 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)' :
                        pageData.page_pattern === 'waves' ? 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")' :
                        pageData.page_pattern === 'diagonal' ? 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)' : 'none',
                      backgroundSize: 
                        pageData.page_pattern === 'dots' ? '20px 20px' :
                        pageData.page_pattern === 'grid' ? '20px 20px' :
                        pageData.page_pattern === 'waves' ? '100px 20px' :
                        pageData.page_pattern === 'diagonal' ? '14px 14px' : 'auto',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <span className="font-medium">Pattern Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AppearanceSettingsTab;
