
import React from "react";
import { PageSettings } from "../types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface IntegrationsTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ pageSettings, setPageSettings }) => {
  const updateSettings = (key: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">WAKTI Booking System</h3>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Connect your booking system</p>
              <p className="text-xs text-muted-foreground">Allow customers to book appointments directly from your page</p>
            </div>
            <Button variant="outline" className="shrink-0">
              <ExternalLink className="h-4 w-4 mr-1" /> 
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Social Media Integration</h3>
        <Card className="mb-4">
          <CardContent className="p-4">
            <p className="font-medium">Instagram Feed</p>
            <p className="text-xs text-muted-foreground mb-2">Display your latest Instagram posts</p>
            <Label htmlFor="instagram-username" className="text-xs">Instagram Username</Label>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 px-2 bg-gray-100 border border-r-0 rounded-l-md">@</span>
              <input
                id="instagram-username"
                className="flex h-9 w-full rounded-none rounded-r-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="yourusername"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="font-medium">Facebook Feed</p>
            <p className="text-xs text-muted-foreground mb-2">Display your Facebook page posts</p>
            <Label htmlFor="facebook-page-id" className="text-xs">Facebook Page ID or Name</Label>
            <input
              id="facebook-page-id"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              placeholder="yourbusiness"
            />
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">TMW AI Chatbot Integration</h3>
        <Label htmlFor="chatbot-code">Chatbot Code</Label>
        <Textarea
          id="chatbot-code"
          value={pageSettings.tmwChatbotCode}
          onChange={(e) => updateSettings('tmwChatbotCode', e.target.value)}
          placeholder="Paste your TMW AI Chatbot code here"
          className="font-mono text-xs h-32 mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Get your embed code from the TMW AI Dashboard
        </p>
        <div className="mt-3">
          <Button variant="outline" size="sm" asChild>
            <a href="https://tmw.qa/ai-chat-bot/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Get TMW AI Chatbot
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
