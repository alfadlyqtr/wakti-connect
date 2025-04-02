
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AIAssistantSettings } from "@/components/settings/ai/AIAssistantSettings";

export const AISettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          asChild
        >
          <Link to="/dashboard/ai-assistant">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold">AI Assistant Settings</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customize Your AI Experience</CardTitle>
          <CardDescription>
            Personalize how your AI assistant works and what information it has access to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIAssistantSettings />
        </CardContent>
      </Card>
    </div>
  );
};
