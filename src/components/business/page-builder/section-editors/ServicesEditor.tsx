
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditorProps } from "./types";

const ServicesEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const handleSwitchChange = (name: string, checked: boolean) => {
    // Create a custom handler for the switch that will call the parent's handleInputChange
    // with the appropriate value, properly cast to unknown first to avoid TypeScript errors
    handleInputChange({
      target: {
        name,
        value: checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={contentData.title || "Our Services"}
              onChange={handleInputChange}
              placeholder="Section Title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              name="description"
              value={contentData.description || "We offer a variety of professional services"}
              onChange={handleInputChange}
              placeholder="Section Description"
              rows={3}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showPrices">Show Prices</Label>
            <Switch
              id="showPrices"
              name="showPrices"
              checked={contentData.showPrices !== false}
              onCheckedChange={(checked) => handleSwitchChange("showPrices", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showDuration">Show Duration</Label>
            <Switch
              id="showDuration"
              name="showDuration"
              checked={contentData.showDuration !== false}
              onCheckedChange={(checked) => handleSwitchChange("showDuration", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="displayAsCards">Display as Cards</Label>
            <Switch
              id="displayAsCards"
              name="displayAsCards"
              checked={contentData.displayAsCards !== false}
              onCheckedChange={(checked) => handleSwitchChange("displayAsCards", checked)}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ServicesEditor;
