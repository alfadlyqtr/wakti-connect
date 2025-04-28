
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorProps } from "./types";
import SectionStyleEditor from "./SectionStyleEditor";
import { useSectionEditor } from "@/hooks/useSectionEditor";

const HeaderEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const { handleStyleChange } = useSectionEditor();
  
  // Create an adapter function for input components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Header Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleChange}
          placeholder="Welcome to our business"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={contentData.subtitle || ""}
          onChange={handleChange}
          placeholder="Book our services online"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={contentData.description || ""}
          onChange={handleChange}
          placeholder="Welcome to our business page"
          rows={3}
        />
      </div>
      
      <SectionStyleEditor 
        contentData={contentData}
        handleInputChange={handleInputChange}
        handleStyleChange={handleStyleChange}
      />
    </>
  );
};

export default HeaderEditor;
