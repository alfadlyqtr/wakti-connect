
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Bot } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAISettings } from "./context/AISettingsContext";

export const AIPersonalityTab: React.FC = () => {
  const { settings, updateSettings, isUpdatingSettings } = useAISettings();
  
  if (!settings) return null;

  const handleToneChange = (value: "professional" | "friendly" | "balanced" | "formal" | "casual") => {
    updateSettings({
      ...settings,
      tone: value,
    });
  };

  const handleResponseLengthChange = (value: "concise" | "balanced" | "detailed") => {
    updateSettings({
      ...settings,
      response_length: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          AI Personality Settings
        </CardTitle>
        <CardDescription>
          Customize how your AI assistant interacts with you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="assistant_name">Assistant Name</Label>
          <Input 
            id="assistant_name" 
            value="WAKTI AI"
            disabled={true}
            className="bg-gray-100"
            placeholder="WAKTI AI"
          />
          <p className="text-xs text-muted-foreground">
            The assistant name is set to WAKTI AI and cannot be changed.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>AI Tone</Label>
          <RadioGroup 
            value={settings.tone} 
            onValueChange={handleToneChange}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal" />
              <Label htmlFor="formal" className="cursor-pointer">Formal & Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual" className="cursor-pointer">Casual & Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="cursor-pointer">Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly" className="cursor-pointer">Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Response Length</Label>
          <RadioGroup 
            value={settings.response_length} 
            onValueChange={handleResponseLengthChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise" />
              <Label htmlFor="concise" className="cursor-pointer">Short & Quick Responses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_length" />
              <Label htmlFor="balanced_length" className="cursor-pointer">Balanced Responses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed_length" />
              <Label htmlFor="detailed_length" className="cursor-pointer">In-Depth Responses</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => updateSettings(settings)}
          disabled={isUpdatingSettings}
          className="w-full"
        >
          {isUpdatingSettings ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Personality Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
