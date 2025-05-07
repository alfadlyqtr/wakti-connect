
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorProps } from "../types";
import GalleryUploadSection from "./GalleryUploadSection";
import GalleryImagesSection from "./GalleryImagesSection";
import GalleryTemplateSection from "./GalleryTemplateSection";
import SectionStyleEditor from "../SectionStyleEditor";
import { useSectionEditor } from "@/hooks/useSectionEditor";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const { handleStyleChange } = useSectionEditor();
  // Initialize the images array if it doesn't exist
  const images = contentData.images || [];
  
  // Create an adapter function for standard input components
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          onChange={handleTextInputChange}
          placeholder="Our Gallery"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Gallery Description</Label>
        <Input
          id="description"
          name="description"
          value={contentData.description || ""}
          onChange={handleTextInputChange}
          placeholder="Check out our recent work"
        />
      </div>
      
      {/* Layout templates section */}
      <div className="pt-4 border-t border-border">
        <GalleryTemplateSection 
          contentData={contentData}
          handleInputChange={handleInputChange}
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
      
      {/* Section styling options */}
      <div className="pt-4 border-t border-border">
        <SectionStyleEditor
          contentData={contentData}
          handleInputChange={handleInputChange}
          handleStyleChange={handleStyleChange}
        />
      </div>
    </div>
  );
};

export default GalleryEditor;
