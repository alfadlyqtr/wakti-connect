
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditorProps } from "./types";

const HoursEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleInputChange}
          placeholder="Business Hours"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Configure your business hours in the detailed editor.
      </p>
    </>
  );
};

export default HoursEditor;
