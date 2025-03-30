
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionStyleEditorProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStyleChange: (name: string, value: string) => void;
}

const SectionStyleEditor: React.FC<SectionStyleEditorProps> = ({
  contentData,
  handleInputChange,
  handleStyleChange
}) => {
  return (
    <Collapsible className="mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex w-full justify-between items-center p-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="font-medium">Section Styling</span>
          </div>
          <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 px-2 pt-4">
        <div className="space-y-2">
          <Label htmlFor="section_background_color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="section_background_color"
              name="background_color"
              type="color"
              value={contentData.background_color || '#ffffff'}
              onChange={(e) => handleStyleChange('background_color', e.target.value)}
              className="w-12 h-9 p-1"
            />
            <Input
              type="text"
              value={contentData.background_color || ''}
              onChange={(e) => handleStyleChange('background_color', e.target.value)}
              placeholder="Transparent (default)"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section_text_color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="section_text_color"
              name="text_color"
              type="color"
              value={contentData.text_color || '#000000'}
              onChange={(e) => handleStyleChange('text_color', e.target.value)}
              className="w-12 h-9 p-1"
            />
            <Input
              type="text"
              value={contentData.text_color || ''}
              onChange={(e) => handleStyleChange('text_color', e.target.value)}
              placeholder="Inherit (default)"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section_padding">Padding</Label>
          <Select 
            value={contentData.padding || 'default'} 
            onValueChange={(value) => handleStyleChange('padding', value)}
          >
            <SelectTrigger id="section_padding">
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="none">None (0)</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section_border_radius">Border Radius</Label>
          <Select 
            value={contentData.border_radius || 'default'} 
            onValueChange={(value) => handleStyleChange('border_radius', value)}
          >
            <SelectTrigger id="section_border_radius">
              <SelectValue placeholder="Select border radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (page setting)</SelectItem>
              <SelectItem value="none">None (0px)</SelectItem>
              <SelectItem value="small">Small (4px)</SelectItem>
              <SelectItem value="medium">Medium (8px)</SelectItem>
              <SelectItem value="large">Large (12px)</SelectItem>
              <SelectItem value="full">Full (rounded)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section_background_image">Background Image URL</Label>
          <Input
            id="section_background_image"
            name="background_image_url"
            value={contentData.background_image_url || ''}
            onChange={(e) => handleStyleChange('background_image_url', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SectionStyleEditor;
