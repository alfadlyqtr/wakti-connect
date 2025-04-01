
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface AdvancedSettingsTabProps {
  pageData: {
    chatbot_enabled: boolean;
    chatbot_code: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  updatePage: UseMutationResult<any, unknown, { pageId: string; data: any; }, unknown>;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  updatePage
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveAdvancedSettings = async () => {
    setIsSaving(true);
    try {
      await updatePage.mutateAsync({
        pageId: updatePage.variables?.pageId,
        data: {
          chatbot_enabled: pageData.chatbot_enabled,
          chatbot_code: pageData.chatbot_code
        }
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Configure advanced settings for your business page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chatbot">
          <TabsList className="mb-4">
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chatbot">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chatbot_enabled" className="text-base">Enable AI Chatbot</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an AI chatbot to your business page to help visitors
                  </p>
                </div>
                <Switch
                  id="chatbot_enabled"
                  checked={pageData.chatbot_enabled}
                  onCheckedChange={(checked) => handleToggleWithAutoSave('chatbot_enabled', checked)}
                />
              </div>
              
              {pageData.chatbot_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="chatbot_code">Chatbot Code</Label>
                  <Textarea
                    id="chatbot_code"
                    name="chatbot_code"
                    value={pageData.chatbot_code || ''}
                    onChange={handleInputChangeWithAutoSave}
                    placeholder="Paste your TMW AI Chatbot embed code here"
                    rows={5}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the TMW AI Chatbot embed code here. You can get this from your TMW console.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveAdvancedSettings}
          disabled={isSaving || updatePage.isPending}
          className="ml-auto"
        >
          {isSaving || updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Advanced Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedSettingsTab;
