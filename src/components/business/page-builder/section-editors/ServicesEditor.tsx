
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ServicesEditorProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ServicesEditor: React.FC<ServicesEditorProps> = ({ contentData, handleInputChange }) => {
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
              onChange={(e) => {
                const syntheticEvent = {
                  target: {
                    name: "showPrices",
                    value: e.target.checked
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(syntheticEvent);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showDuration">Show Duration</Label>
            <Switch
              id="showDuration"
              name="showDuration"
              checked={contentData.showDuration !== false}
              onChange={(e) => {
                const syntheticEvent = {
                  target: {
                    name: "showDuration",
                    value: e.target.checked
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(syntheticEvent);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="displayAsCards">Display as Cards</Label>
            <Switch
              id="displayAsCards"
              name="displayAsCards"
              checked={contentData.displayAsCards !== false}
              onChange={(e) => {
                const syntheticEvent = {
                  target: {
                    name: "displayAsCards",
                    value: e.target.checked
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(syntheticEvent);
              }}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ServicesEditor;
