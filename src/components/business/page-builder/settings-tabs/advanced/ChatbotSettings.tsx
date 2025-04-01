
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ChatbotSettingsProps {
  chatbotEnabled: boolean;
  chatbotCode: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
}

const ChatbotSettings: React.FC<ChatbotSettingsProps> = ({
  chatbotEnabled,
  chatbotCode,
  handleInputChange,
  handleToggleChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="chatbot_enabled">Enable Chatbot</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, the TMW AI Chatbot will be displayed on your page
          </p>
        </div>
        <Switch
          id="chatbot_enabled"
          checked={!!chatbotEnabled}
          onCheckedChange={(checked) => handleToggleChange('chatbot_enabled', checked)}
        />
      </div>
      
      {chatbotEnabled && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="chatbot_code">Chatbot Embed Code</Label>
          <Textarea
            id="chatbot_code"
            name="chatbot_code"
            value={chatbotCode || ""}
            onChange={handleInputChange}
            placeholder="Paste your TMW AI Chatbot embed code here"
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste the embed code provided by TMW AI Chatbot platform
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotSettings;
