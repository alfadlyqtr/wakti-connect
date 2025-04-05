
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAISettings } from "./context/AISettingsContext";
import { useTranslation } from "react-i18next";

export const AIFeaturesTab: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, isUpdatingSettings } = useAISettings();
  
  if (!settings) return null;

  const handleProactivenessChange = (checked: boolean) => {
    updateSettings({
      ...settings,
      proactiveness: checked,
    });
  };

  const handleSuggestionFrequencyChange = (value: "low" | "medium" | "high") => {
    updateSettings({
      ...settings,
      suggestion_frequency: value,
    });
  };

  const handleFeatureToggle = (feature: keyof typeof settings.enabled_features, checked: boolean) => {
    updateSettings({
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
        <CardTitle>{t("aiSettings.features.title")}</CardTitle>
        <CardDescription>
          {t("aiSettings.features.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="proactiveness">{t("aiSettings.features.proactiveness")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("aiSettings.features.proactivenessDescription")}
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
          <Label>{t("aiSettings.features.suggestionFrequency")}</Label>
          <p className="text-sm text-muted-foreground">
            {t("aiSettings.features.suggestionFrequencyDescription")}
          </p>
          <RadioGroup 
            value={settings.suggestion_frequency} 
            onValueChange={handleSuggestionFrequencyChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low_freq" />
              <Label htmlFor="low_freq" className="cursor-pointer">{t("aiSettings.frequency.low")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium_freq" />
              <Label htmlFor="medium_freq" className="cursor-pointer">{t("aiSettings.frequency.medium")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high_freq" />
              <Label htmlFor="high_freq" className="cursor-pointer">{t("aiSettings.frequency.high")}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>{t("aiSettings.features.enabledFeatures")}</Label>
          <p className="text-sm text-muted-foreground">
            {t("aiSettings.features.selectFeatures")}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tasks_feature" className="cursor-pointer">{t("aiSettings.features.taskManagement")}</Label>
              <Switch
                id="tasks_feature"
                checked={settings.enabled_features.tasks}
                onCheckedChange={(checked) => handleFeatureToggle("tasks", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="events_feature" className="cursor-pointer">{t("aiSettings.features.eventPlanning")}</Label>
              <Switch
                id="events_feature"
                checked={settings.enabled_features.events}
                onCheckedChange={(checked) => handleFeatureToggle("events", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="staff_feature" className="cursor-pointer">{t("aiSettings.features.staffManagement")}</Label>
              <Switch
                id="staff_feature"
                checked={settings.enabled_features.staff}
                onCheckedChange={(checked) => handleFeatureToggle("staff", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics_feature" className="cursor-pointer">{t("aiSettings.features.analytics")}</Label>
              <Switch
                id="analytics_feature"
                checked={settings.enabled_features.analytics}
                onCheckedChange={(checked) => handleFeatureToggle("analytics", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="messaging_feature" className="cursor-pointer">{t("aiSettings.features.messagingAssistance")}</Label>
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
          onClick={() => updateSettings(settings)}
          disabled={isUpdatingSettings}
          className="w-full"
        >
          {isUpdatingSettings ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("aiSettings.saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("aiSettings.saveFeatures")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
