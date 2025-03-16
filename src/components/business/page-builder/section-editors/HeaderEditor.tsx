
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorProps } from "./types";

const HeaderEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Header Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleInputChange}
          placeholder="Welcome to our business"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={contentData.subtitle || ""}
          onChange={handleInputChange}
          placeholder="Book our services online"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={contentData.description || ""}
          onChange={handleInputChange}
          placeholder="Welcome to our business page"
          rows={3}
        />
      </div>
    </>
  );
};

export default HeaderEditor;
