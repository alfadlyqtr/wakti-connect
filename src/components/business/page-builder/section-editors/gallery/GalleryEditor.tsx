
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorProps } from "../types";
import GalleryUploadSection from "./GalleryUploadSection";
import GalleryImagesSection from "./GalleryImagesSection";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Initialize the images array if it doesn't exist
  const images = contentData.images || [];
  
  // Create an adapter function for standard input components
  const handleStandardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Gallery Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleStandardInputChange}
          placeholder="Our Gallery"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subtitle">Gallery Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={contentData.subtitle || ""}
          onChange={handleStandardInputChange}
          placeholder="Check out our recent work"
        />
      </div>
      
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="images">Gallery Images</TabsTrigger>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="pt-4">
          <GalleryImagesSection 
            images={images}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="upload" className="pt-4">
          <GalleryUploadSection 
            images={images}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryEditor;
