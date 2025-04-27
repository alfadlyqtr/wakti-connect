
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAISettings } from './context/AISettingsContext';
import { AlertOctagon, Mic, Megaphone, CheckSquare, CalendarRange, Brain, Lock } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

export function AIFeaturesTab() {
  const { settings, updateFeature, isLoading } = useAISettings();
  
  if (isLoading || !settings) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading AI features...</p>
      </div>
    );
  }
  
  const handleFeatureToggle = (feature: keyof typeof settings.enabled_features) => {
    if (!settings) return;

    // Check if the feature exists
    if (feature in settings.enabled_features) {
      // Type assertion to ensure TypeScript recognizes the feature as a valid key
      const featureKey = feature as keyof typeof settings.enabled_features;
      const newValue = !settings.enabled_features[featureKey];
      
      updateFeature(featureKey, newValue)
        .then(() => {
          toast({
            title: newValue ? "Feature enabled" : "Feature disabled",
            description: `${feature.replace(/_/g, ' ')} has been ${newValue ? 'enabled' : 'disabled'}.`,
          });
        })
        .catch((err) => {
          console.error(`Error updating ${feature}:`, err);
          toast({
            variant: "destructive",
            title: "Update failed",
            description: `Failed to update ${feature.replace(/_/g, ' ')}.`,
          });
        });
    } else {
      console.error(`Feature ${feature} doesn't exist in settings.enabled_features`);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">AI Assistant Features</h3>
      <p className="text-sm text-muted-foreground">
        Configure which AI features are enabled for your WAKTI assistant.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Core Features Card */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-4">Core Features</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <Label htmlFor="voice-input">Voice Input</Label>
                </div>
                <Switch
                  id="voice-input"
                  checked={settings.enabled_features.voice_input}
                  onCheckedChange={() => handleFeatureToggle('voice_input')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-primary" />
                  <Label htmlFor="voice-output">Voice Output</Label>
                </div>
                <Switch
                  id="voice-output"
                  checked={settings.enabled_features.voice_output}
                  onCheckedChange={() => handleFeatureToggle('voice_output')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="task-detection">Task Detection</Label>
                </div>
                <Switch
                  id="task-detection"
                  checked={settings.enabled_features.task_detection}
                  onCheckedChange={() => handleFeatureToggle('task_detection')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarRange className="w-4 h-4 text-primary" />
                  <Label htmlFor="meeting-scheduling">Meeting Scheduling</Label>
                </div>
                <Switch
                  id="meeting-scheduling"
                  checked={settings.enabled_features.meeting_scheduling}
                  onCheckedChange={() => handleFeatureToggle('meeting_scheduling')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <Label htmlFor="personalized-suggestions">Personalized Suggestions</Label>
                </div>
                <Switch
                  id="personalized-suggestions"
                  checked={settings.enabled_features.personalized_suggestions}
                  onCheckedChange={() => handleFeatureToggle('personalized_suggestions')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Integration Features Card */}
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-sm font-semibold mb-4">Integration Features</h4>
            
            <div className="space-y-4">
              {/* Tasks Integration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="tasks-integration">Tasks Integration</Label>
                </div>
                {settings.enabled_features.tasks !== undefined && (
                  <Switch
                    id="tasks-integration"
                    checked={settings.enabled_features.tasks}
                    onCheckedChange={() => handleFeatureToggle('tasks')}
                  />
                )}
              </div>
              
              {/* Events Integration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarRange className="w-4 h-4 text-primary" />
                  <Label htmlFor="events-integration">Events Integration</Label>
                </div>
                {settings.enabled_features.events !== undefined && (
                  <Switch
                    id="events-integration"
                    checked={settings.enabled_features.events}
                    onCheckedChange={() => handleFeatureToggle('events')}
                  />
                )}
              </div>
              
              {/* Staff Integration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="staff-integration">Staff Integration</Label>
                </div>
                {settings.enabled_features.staff !== undefined && (
                  <Switch
                    id="staff-integration"
                    checked={settings.enabled_features.staff}
                    onCheckedChange={() => handleFeatureToggle('staff')}
                  />
                )}
              </div>
              
              {/* Analytics Integration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="analytics-integration">Analytics Integration</Label>
                </div>
                {settings.enabled_features.analytics !== undefined && (
                  <Switch
                    id="analytics-integration"
                    checked={settings.enabled_features.analytics}
                    onCheckedChange={() => handleFeatureToggle('analytics')}
                  />
                )}
              </div>
              
              {/* Messaging Integration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <Label htmlFor="messaging-integration">Messaging Integration</Label>
                </div>
                {settings.enabled_features.messaging !== undefined && (
                  <Switch
                    id="messaging-integration"
                    checked={settings.enabled_features.messaging}
                    onCheckedChange={() => handleFeatureToggle('messaging')}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Premium Features Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold">Premium Features</h4>
            <Button variant="outline" size="sm" className="h-8">
              <Lock className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 opacity-50">
                <Brain className="w-4 h-4" />
                <Label htmlFor="custom-knowledge">Custom Knowledge Base</Label>
              </div>
              <Switch id="custom-knowledge" disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 opacity-50">
                <AlertOctagon className="w-4 h-4" />
                <Label htmlFor="priority-support">Priority Support</Label>
              </div>
              <Switch id="priority-support" disabled />
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Premium features require a paid subscription.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
