
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
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const { handleStyleChange } = useSectionEditor();
  // Initialize the images array if it doesn't exist
  const images = contentData.images || [];
  const [activeTab, setActiveTab] = useState<string>("layout");
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="upload">Add Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="pt-4">
          <GalleryTemplateSection 
            contentData={contentData}
            handleInputChange={handleInputChange}
          />
          
          {/* Quick upload button in layout tab */}
          {images.length === 0 && (
            <div className="flex justify-center mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Your First Image</span>
              </Button>
            </div>
          )}
        </TabsContent>
        
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
