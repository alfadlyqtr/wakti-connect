
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
              <Label htmlFor="voice_input_feature" className="cursor-pointer">{t("aiSettings.features.voiceInput")}</Label>
              <Switch
                id="voice_input_feature"
                checked={settings.enabled_features.voice_input}
                onCheckedChange={(checked) => handleFeatureToggle("voice_input", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="voice_output_feature" className="cursor-pointer">{t("aiSettings.features.voiceOutput")}</Label>
              <Switch
                id="voice_output_feature"
                checked={settings.enabled_features.voice_output}
                onCheckedChange={(checked) => handleFeatureToggle("voice_output", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="task_detection_feature" className="cursor-pointer">{t("aiSettings.features.taskDetection")}</Label>
              <Switch
                id="task_detection_feature"
                checked={settings.enabled_features.task_detection}
                onCheckedChange={(checked) => handleFeatureToggle("task_detection", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="meeting_scheduling_feature" className="cursor-pointer">{t("aiSettings.features.meetingScheduling")}</Label>
              <Switch
                id="meeting_scheduling_feature"
                checked={settings.enabled_features.meeting_scheduling}
                onCheckedChange={(checked) => handleFeatureToggle("meeting_scheduling", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="personalized_suggestions_feature" className="cursor-pointer">{t("aiSettings.features.personalizedSuggestions")}</Label>
              <Switch
                id="personalized_suggestions_feature"
                checked={settings.enabled_features.personalized_suggestions}
                onCheckedChange={(checked) => handleFeatureToggle("personalized_suggestions", checked)}
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
