
import React from "react";
import { useCustomization } from "../context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapDisplayOptions } from "../tabs/features/MapDisplayOptions";

const FeaturesTabContent: React.FC = () => {
  const {
    customization,
    handleAddToCalendarChange,
    handleChatbotChange,
    handleMapDisplayChange
  } = useCustomization();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Calendar button toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="add-to-calendar">Add to Calendar</Label>
                <p className="text-sm text-muted-foreground">
                  Show a button to add this event to calendar
                </p>
              </div>
              <Switch
                id="add-to-calendar"
                checked={customization.enableAddToCalendar !== false}
                onCheckedChange={handleAddToCalendarChange}
              />
            </div>
            
            {/* Map display options */}
            <MapDisplayOptions 
              mapDisplay={customization.mapDisplay || 'both'} 
              onMapDisplayChange={handleMapDisplayChange} 
            />

            {/* Chatbot toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-chatbot">Event Assistant</Label>
                <p className="text-sm text-muted-foreground">
                  Enable AI assistant for event questions
                </p>
              </div>
              <Switch
                id="enable-chatbot"
                checked={customization.enableChatbot === true}
                onCheckedChange={handleChatbotChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesTabContent;
