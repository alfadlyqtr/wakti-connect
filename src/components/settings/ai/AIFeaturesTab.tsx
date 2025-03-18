
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { AISettings } from "@/types/ai-assistant.types";

interface AIFeaturesTabProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const AIFeaturesTab: React.FC<AIFeaturesTabProps> = ({
  settings,
  onSettingsChange,
  onSave,
  isSaving,
}) => {
  const handleProactivenessChange = (checked: boolean) => {
    onSettingsChange({
      ...settings,
      proactiveness: checked,
    });
  };

  const handleSuggestionFrequencyChange = (value: "low" | "medium" | "high") => {
    onSettingsChange({
      ...settings,
      suggestion_frequency: value,
    });
  };

  const handleFeatureToggle = (feature: keyof typeof settings.enabled_features, checked: boolean) => {
    onSettingsChange({
      ...settings,
      enabled_features: {
        ...settings.enabled_features,
        [feature]: checked,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Features & Behavior</CardTitle>
        <CardDescription>
          Control how the AI assistant behaves and what features it uses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="proactiveness">AI Proactiveness</Label>
            <p className="text-sm text-muted-foreground">
              Allow AI to suggest actions based on your activity
            </p>
          </div>
          <Switch
            id="proactiveness"
            checked={settings.proactiveness}
            onCheckedChange={handleProactivenessChange}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Suggestion Frequency</Label>
          <p className="text-sm text-muted-foreground">
            How often should the AI offer suggestions and ideas
          </p>
          <RadioGroup 
            value={settings.suggestion_frequency} 
            onValueChange={handleSuggestionFrequencyChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low_freq" />
              <Label htmlFor="low_freq" className="cursor-pointer">Low - Minimal suggestions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium_freq" />
              <Label htmlFor="medium_freq" className="cursor-pointer">Medium - Balanced suggestions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high_freq" />
              <Label htmlFor="high_freq" className="cursor-pointer">High - Frequent suggestions</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Enabled Features</Label>
          <p className="text-sm text-muted-foreground">
            Select which features the AI assistant can help with
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tasks_feature" className="cursor-pointer">Task Management</Label>
              <Switch
                id="tasks_feature"
                checked={settings.enabled_features.tasks}
                onCheckedChange={(checked) => handleFeatureToggle("tasks", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="events_feature" className="cursor-pointer">Event Planning</Label>
              <Switch
                id="events_feature"
                checked={settings.enabled_features.events}
                onCheckedChange={(checked) => handleFeatureToggle("events", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="staff_feature" className="cursor-pointer">Staff Management</Label>
              <Switch
                id="staff_feature"
                checked={settings.enabled_features.staff}
                onCheckedChange={(checked) => handleFeatureToggle("staff", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics_feature" className="cursor-pointer">Analytics & Insights</Label>
              <Switch
                id="analytics_feature"
                checked={settings.enabled_features.analytics}
                onCheckedChange={(checked) => handleFeatureToggle("analytics", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="messaging_feature" className="cursor-pointer">Messaging Assistance</Label>
              <Switch
                id="messaging_feature"
                checked={settings.enabled_features.messaging}
                onCheckedChange={(checked) => handleFeatureToggle("messaging", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Feature Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
