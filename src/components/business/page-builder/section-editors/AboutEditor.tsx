
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorProps } from "./types";

const AboutEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Create an adapter function for input components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleChange}
          placeholder="About Us"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">About Content</Label>
        <Textarea
          id="content"
          name="content"
          value={contentData.content || ""}
          onChange={handleChange}
          placeholder="Tell your story and describe your business..."
          rows={5}
        />
      </div>
    </>
  );
};

export default AboutEditor;
