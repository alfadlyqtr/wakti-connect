
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditorProps } from "./types";

const DefaultEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Create an adapter function for the Input component
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="title">Section Title</Label>
      <Input
        id="title"
        name="title"
        value={contentData.title || ""}
        onChange={handleChange}
        placeholder="Section Title"
      />
      <p className="text-sm text-muted-foreground mt-4">
        Additional settings for this section type are available in the detailed editor.
      </p>
    </div>
  );
};

export default DefaultEditor;
