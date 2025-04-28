
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditorProps } from "../types";

const GalleryHeaderSection: React.FC<EditorProps> = ({
  contentData,
  handleInputChange
}) => {
  // Helper function to handle select changes
  const handleSelectChange = (name: string, value: string) => {
    handleInputChange(name, value);
  };
  
  // Helper function to handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    handleInputChange(name, checked);
  };
  
  // Adapter for handling standard input change events
  const handleStandardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Gallery Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || "Gallery"}
          onChange={handleStandardInputChange}
          placeholder="Enter gallery title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Gallery Description</Label>
        <Textarea
          id="description"
          name="description"
          value={contentData.description || "Take a look at our work"}
          onChange={handleStandardInputChange}
          placeholder="Enter gallery description"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="layout">Gallery Layout</Label>
          <Select 
            value={contentData.layout || "grid"} 
            onValueChange={(value) => handleSelectChange("layout", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="imageFit">Image Fit</Label>
          <Select 
            value={contentData.imageFit || "cover"} 
            onValueChange={(value) => handleSelectChange("imageFit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select image fit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover (fill container)</SelectItem>
              <SelectItem value="contain">Contain (show whole image)</SelectItem>
              <SelectItem value="fill">Fill (stretch to fit)</SelectItem>
              <SelectItem value="none">None (natural size)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <div>
          <Label htmlFor="showCaption">Show Image Captions</Label>
          <p className="text-sm text-muted-foreground">Display captions for each image</p>
        </div>
        <Switch
          id="showCaption"
          checked={contentData.showCaption || false}
          onCheckedChange={(checked) => handleToggleChange("showCaption", checked)}
        />
      </div>
    </div>
  );
};

export default GalleryHeaderSection;
