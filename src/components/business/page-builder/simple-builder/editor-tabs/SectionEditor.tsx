
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionType } from "../types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";

interface SectionEditorProps {
  section: SectionType;
  updateSection: (section: SectionType) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, updateSection }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSection({
      ...section,
      [name]: value
    });
  };
  
  const handleContentChange = (name: string, value: any) => {
    updateSection({
      ...section,
      content: {
        ...section.content,
        [name]: value
      }
    });
  };
  
  const handleLayoutChange = (layout: string) => {
    updateSection({
      ...section,
      activeLayout: layout
    });
  };
  
  // Render different editor fields based on section type
  const renderSectionFields = () => {
    switch (section.type) {
      case "header":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input 
                id="logoUrl" 
                name="logoUrl" 
                value={section.content.logoUrl || ''} 
                onChange={(e) => handleContentChange('logoUrl', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Logo Position</Label>
              <Select 
                value={section.activeLayout} 
                onValueChange={handleLayoutChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Center</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "about":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="backgroundImageUrl">Image URL</Label>
              <Input 
                id="backgroundImageUrl" 
                name="backgroundImageUrl" 
                value={section.backgroundImageUrl || ''}
                onChange={(e) => updateSection({...section, backgroundImageUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Layout</Label>
              <Select 
                value={section.activeLayout} 
                onValueChange={handleLayoutChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="columns">Image Right</SelectItem>
                  <SelectItem value="image-left">Image Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "booking":
        return (
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select 
              value={section.activeLayout} 
              onValueChange={handleLayoutChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case "social":
        return (
          <div className="space-y-2">
            <Label>Style</Label>
            <Select 
              value={section.activeLayout} 
              onValueChange={handleLayoutChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Icons Only</SelectItem>
                <SelectItem value="vertical">Icons with Text</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="pt-4 space-y-2">
              <Label>Social Media Platforms</Label>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {['facebook', 'instagram', 'twitter', 'email', 'phone', 'whatsapp'].map(platform => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={section.content.platforms?.[platform] || false}
                      onChange={(e) => {
                        const currentPlatforms = section.content.platforms || {};
                        handleContentChange('platforms', {
                          ...currentPlatforms,
                          [platform]: e.target.checked
                        });
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "hours":
        return (
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select 
              value={section.activeLayout} 
              onValueChange={handleLayoutChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case "chatbot":
        return (
          <div className="space-y-2">
            <Label htmlFor="chatbotCode">TMW Chatbot Embed Code</Label>
            <Textarea 
              id="chatbotCode" 
              name="chatbotCode" 
              value={section.content.embedCode || ''} 
              onChange={(e) => handleContentChange('embedCode', e.target.value)}
              className="min-h-[100px]" 
            />
            <p className="text-xs text-muted-foreground">
              Paste the embed code from your TMW AI Chatbot here.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Edit Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input 
            id="title" 
            name="title" 
            value={section.title} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle (Optional)</Label>
          <Input 
            id="subtitle" 
            name="subtitle" 
            value={section.subtitle || ''} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={section.description || ''} 
            onChange={handleInputChange} 
          />
        </div>
        
        {renderSectionFields()}
      </CardContent>
    </Card>
  );
};

export default SectionEditor;
