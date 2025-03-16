
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AdvancedSettingsTabProps {
  pageData: {
    chatbot_enabled: boolean;
    chatbot_code?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Configure additional settings for your business page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="chatbot_enabled"
              checked={pageData.chatbot_enabled}
              onCheckedChange={(checked) => handleToggleWithAutoSave('chatbot_enabled', checked)}
            />
            <Label htmlFor="chatbot_enabled" className="font-medium">
              Enable TMW AI Chatbot
            </Label>
          </div>
          
          {pageData.chatbot_enabled && (
            <div className="ml-7 space-y-2 border-l-2 pl-4 border-primary/20">
              <Label htmlFor="chatbot_code">TMW AI Chatbot Installation Code</Label>
              <Textarea
                id="chatbot_code"
                name="chatbot_code"
                value={pageData.chatbot_code || ""}
                onChange={handleInputChangeWithAutoSave}
                placeholder="Paste your TMW AI Chatbot installation code here"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Don't have a TMW AI Chatbot yet? <a 
                  href="https://tmw.qa/ai-chat-bot/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get one here
                </a> to enhance your business with AI-powered customer service.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSettingsTab;
