
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { ColorPicker } from "@/components/ui/color-picker";

interface AppearanceSettingsTabProps {
  pageData: Partial<BusinessPage>;
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  handleColorChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  updatePage: UseMutationResult<any, unknown, { pageId: string; data: any; }, unknown>;
}

const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  handleColorChange,
  handleSelectChange,
  updatePage
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveAppearanceSettings = async () => {
    setIsSaving(true);
    try {
      await updatePage.mutateAsync({
        pageId: updatePage.variables?.pageId,
        data: {
          primary_color: pageData.primary_color,
          secondary_color: pageData.secondary_color,
          text_color: pageData.text_color,
          background_color: pageData.background_color,
          font_family: pageData.font_family,
          border_radius: pageData.border_radius,
          content_max_width: pageData.content_max_width,
          section_spacing: pageData.section_spacing,
          page_pattern: pageData.page_pattern
        }
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePrimaryColorChange = (value: string) => {
    handleColorChange('primary_color', value);
  };
  
  const handleSecondaryColorChange = (value: string) => {
    handleColorChange('secondary_color', value);
  };
  
  const handleTextColorChange = (value: string) => {
    handleColorChange('text_color', value);
  };
  
  const handleBackgroundColorChange = (value: string) => {
    handleColorChange('background_color', value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your business page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <ColorPicker 
              value={pageData.primary_color || '#3B82F6'} 
              onChange={handlePrimaryColorChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <ColorPicker 
              value={pageData.secondary_color || '#10B981'} 
              onChange={handleSecondaryColorChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Text Color</Label>
            <ColorPicker 
              value={pageData.text_color || '#1F2937'} 
              onChange={handleTextColorChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker 
              value={pageData.background_color || '#FFFFFF'} 
              onChange={handleBackgroundColorChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="font_family">Font Family</Label>
            <Select 
              value={pageData.font_family || 'sans-serif'} 
              onValueChange={(value) => handleSelectChange('font_family', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
                <SelectItem value="system-ui">System UI</SelectItem>
                <SelectItem value="cursive">Cursive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="border_radius">Border Radius</Label>
            <Select 
              value={pageData.border_radius || 'medium'} 
              onValueChange={(value) => handleSelectChange('border_radius', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select border radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content_max_width">Content Max Width</Label>
            <Select 
              value={pageData.content_max_width || '1200px'} 
              onValueChange={(value) => handleSelectChange('content_max_width', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select max width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="768px">Small (768px)</SelectItem>
                <SelectItem value="1024px">Medium (1024px)</SelectItem>
                <SelectItem value="1200px">Large (1200px)</SelectItem>
                <SelectItem value="1536px">Extra Large (1536px)</SelectItem>
                <SelectItem value="100%">Full Width (100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section_spacing">Section Spacing</Label>
            <Select 
              value={pageData.section_spacing || 'default'} 
              onValueChange={(value) => handleSelectChange('section_spacing', value)}
            >
              <SelectTrigger>
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
            <Label htmlFor="page_pattern">Page Pattern</Label>
            <Select 
              value={pageData.page_pattern || 'none'} 
              onValueChange={(value) => handleSelectChange('page_pattern', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select page pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="/patterns/dots.svg">Dots</SelectItem>
                <SelectItem value="/patterns/grid.svg">Grid</SelectItem>
                <SelectItem value="/patterns/waves.svg">Waves</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveAppearanceSettings}
          disabled={isSaving || updatePage.isPending}
          className="ml-auto"
        >
          {isSaving || updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Appearance Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettingsTab;
