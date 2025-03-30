
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AdvancedSettingsTabProps {
  pageData: {
    chatbot_enabled?: boolean;
    chatbot_code?: string;
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
}) => {
  return (
    <div className="space-y-6">
      {/* Subscribe Button Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribe Button</CardTitle>
          <CardDescription>
            Configure your page's subscribe button to gain more followers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_subscribe_button">Show Subscribe Button</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, visitors can subscribe to your business updates
              </p>
            </div>
            <Switch
              id="show_subscribe_button"
              checked={pageData.show_subscribe_button !== false} // Default to true if undefined
              onCheckedChange={(checked) => handleToggleWithAutoSave('show_subscribe_button', checked)}
            />
          </div>
          
          {pageData.show_subscribe_button !== false && (
            <div className="space-y-2 mt-4 border-l-2 border-primary/20 pl-4">
              <div>
                <Label htmlFor="subscribe_button_text">Button Text</Label>
                <Input
                  id="subscribe_button_text"
                  name="subscribe_button_text"
                  value={pageData.subscribe_button_text || "Subscribe"}
                  onChange={handleInputChangeWithAutoSave}
                  placeholder="Subscribe"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Customize what text appears on the subscribe button
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TMW AI Chatbot Settings */}
      <Card>
        <CardHeader>
          <CardTitle>TMW AI Chatbot</CardTitle>
          <CardDescription>
            Integrate the TMW AI Chatbot with your business page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chatbot_enabled">Enable Chatbot</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the TMW AI Chatbot will be displayed on your page
              </p>
            </div>
            <Switch
              id="chatbot_enabled"
              checked={!!pageData.chatbot_enabled}
              onCheckedChange={(checked) => handleToggleWithAutoSave('chatbot_enabled', checked)}
            />
          </div>
          
          {pageData.chatbot_enabled && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="chatbot_code">Chatbot Embed Code</Label>
              <Textarea
                id="chatbot_code"
                name="chatbot_code"
                value={pageData.chatbot_code || ""}
                onChange={handleInputChangeWithAutoSave}
                placeholder="Paste your TMW AI Chatbot embed code here"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the embed code provided by TMW AI Chatbot platform
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettingsTab;
