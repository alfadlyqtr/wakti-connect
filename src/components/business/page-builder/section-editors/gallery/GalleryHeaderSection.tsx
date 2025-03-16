
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GalleryHeaderSectionProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GalleryHeaderSection: React.FC<GalleryHeaderSectionProps> = ({ 
  contentData, 
  handleInputChange 
}) => {
  const handleLayoutChange = (layout: string) => {
    // Type assertion for the synthetic event
    handleInputChange({
      target: {
        name: 'layout',
        value: layout
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  const handleShowCaptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Type assertion for the synthetic event
    handleInputChange({
      target: {
        name: 'showCaptions',
        value: e.target.checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Gallery Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || "Our Gallery"}
          onChange={handleInputChange}
          placeholder="Our Gallery"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="layout">Gallery Layout</Label>
          <Select
            value={contentData.layout || "grid"}
            onValueChange={handleLayoutChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Display Options</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCaptions"
              checked={contentData.showCaptions || false}
              onChange={handleShowCaptionsChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showCaptions">Show Captions</Label>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryHeaderSection;
