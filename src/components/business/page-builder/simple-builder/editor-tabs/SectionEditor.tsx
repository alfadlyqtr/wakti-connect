
import React, { useState } from "react";
import { SectionType } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SectionEditorProps {
  section: SectionType;
  updateSection: (section: SectionType) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, updateSection }) => {
  // Maintain a local state to ensure UI updates immediately
  const [sectionState, setSectionState] = useState<SectionType>(section);
  
  // Update local state and call parent update function
  const handleUpdate = (updatedValues: Partial<SectionType>) => {
    const updated = {
      ...sectionState,
      ...updatedValues
    };
    setSectionState(updated);
    updateSection(updated);
  };
  
  // Handle input change events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleUpdate({ [e.target.name]: e.target.value });
  };
  
  // Handle layout selection
  const handleLayoutChange = (layout: string) => {
    const content = sectionState.content || {};
    handleUpdate({
      activeLayout: layout,
      content: {
        ...content,
        layout: layout
      }
    });
  };
  
  // Prepare UI based on section type
  const getLayoutOptions = () => {
    switch (section.type) {
      case 'header':
        return [
          { value: 'default', label: 'Overlay' },
          { value: 'centered', label: 'Centered' },
          { value: 'split', label: 'Split' }
        ];
      case 'gallery':
        return [
          { value: 'grid', label: 'Grid' },
          { value: 'masonry', label: 'Masonry' },
          { value: 'cards', label: 'Cards' }
        ];
      case 'about':
        return [
          { value: 'standard', label: 'Standard' },
          { value: 'columns', label: 'Two Columns' },
          { value: 'image-left', label: 'Image Left' },
          { value: 'image-right', label: 'Image Right' }
        ];
      case 'testimonials':
        return [
          { value: 'slider', label: 'Slider' },
          { value: 'grid', label: 'Grid' },
          { value: 'cards', label: 'Cards' }
        ];
      default:
        return [
          { value: 'standard', label: 'Standard' },
          { value: 'columns', label: 'Columns' }
        ];
    }
  };
  
  const activeLayout = section.activeLayout || (section.content?.layout || 'default');
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={sectionState.title || ""}
              onChange={handleInputChange}
              placeholder="Enter section title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={sectionState.subtitle || ""}
              onChange={handleInputChange}
              placeholder="Enter section subtitle"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={sectionState.description || ""}
              onChange={handleInputChange}
              placeholder="Enter section description"
              rows={3}
            />
          </div>
          
          {section.type === 'header' && (
            <div className="space-y-2">
              <Label htmlFor="backgroundImageUrl">Background Image URL</Label>
              <Input
                id="backgroundImageUrl"
                name="backgroundImageUrl"
                value={sectionState.backgroundImageUrl || ""}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="layout">Layout Style</Label>
            <Select
              value={activeLayout}
              onValueChange={handleLayoutChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                {getLayoutOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {getLayoutOptions().map(option => (
              <Button
                key={option.value}
                variant={activeLayout === option.value ? "default" : "outline"}
                className="h-auto py-4 flex flex-col gap-2 justify-center items-center"
                onClick={() => handleLayoutChange(option.value)}
              >
                <div className="h-16 w-full bg-muted/50 rounded flex items-center justify-center">
                  {option.label}
                </div>
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionEditor;
