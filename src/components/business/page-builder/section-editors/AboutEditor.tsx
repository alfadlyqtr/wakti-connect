
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EditorProps } from "./types";

const AboutEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Create an adapter function for input components
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name, e.target.value);
  };
  
  // Handle switch toggle
  const handleToggleChange = (name: string, checked: boolean) => {
    handleInputChange(name, checked);
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

      {/* Message Form Configuration */}
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="showMessageForm" className="font-medium">
            Show Message Form
          </Label>
          <Switch 
            id="showMessageForm"
            checked={contentData.showMessageForm || false}
            onCheckedChange={(checked) => handleToggleChange("showMessageForm", checked)}
          />
        </div>
        
        {contentData.showMessageForm && (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="messageFormTitle">Message Form Title</Label>
              <Input
                id="messageFormTitle"
                name="messageFormTitle"
                value={contentData.messageFormTitle || "Send us a message"}
                onChange={handleChange}
                placeholder="Send us a message"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="messageInputPlaceholder">Message Input Placeholder</Label>
              <Input
                id="messageInputPlaceholder"
                name="messageInputPlaceholder"
                value={contentData.messageInputPlaceholder || "Type your message here..."}
                onChange={handleChange}
                placeholder="Type your message here..."
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AboutEditor;
