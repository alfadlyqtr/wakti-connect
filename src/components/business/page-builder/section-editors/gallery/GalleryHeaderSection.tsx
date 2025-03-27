
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorProps } from "../types";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";

const GalleryHeaderSection: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Handle select change since it doesn't generate standard form events
  const handleSelectChange = (name: string, value: string) => {
    handleInputChange({
      target: {
        name,
        value
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Gallery Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={contentData.title || "Gallery"} 
          onChange={handleInputChange}
          placeholder="Gallery Title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Gallery Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={contentData.description || "Take a look at our work"} 
          onChange={handleInputChange}
          placeholder="Gallery Description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="columns">Columns</Label>
          <Select 
            name="columns" 
            value={contentData.columns?.toString() || "3"} 
            onValueChange={(value) => handleSelectChange("columns", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Column</SelectItem>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="imageFit">Image Fit</Label>
          <Select 
            name="imageFit" 
            value={contentData.imageFit || "cover"} 
            onValueChange={(value) => handleSelectChange("imageFit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cover" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeaderSection;
