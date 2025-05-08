
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBusinessPage, Position } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const ChatbotSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { visible, position } = pageData.chatbot;

  const toggleVisibility = () => {
    updateSectionData("chatbot", { visible: !visible });
  };

  const handlePositionChange = (value: string) => {
    if (value as Position) {
      updateSectionData("chatbot", { position: value as Position });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">6. TMW AI Chatbot</CardTitle>
          <Switch 
            checked={visible} 
            onCheckedChange={toggleVisibility}
            aria-label="Toggle visibility"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Position</Label>
            <ToggleGroup 
              type="single" 
              value={position}
              onValueChange={handlePositionChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left position">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right position">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="p-2 bg-muted rounded text-sm">
            <p>Chatbot embed code can be set in the Landing Page Settings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
