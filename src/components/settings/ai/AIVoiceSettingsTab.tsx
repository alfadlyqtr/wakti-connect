
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mic, RefreshCcw } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useTranslation } from "react-i18next";

export const AIVoiceSettingsTab: React.FC = () => {
  const { t } = useTranslation();
  
  const { 
    autoSilenceDetection, 
    visualFeedback,
    toggleAutoSilenceDetection,
    toggleVisualFeedback,
    resetSettings
  } = useVoiceSettings();
  
  const { toast } = useToast();
  
  const {
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction();
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: t("aiSettings.voice.settingsReset"),
      description: t("aiSettings.voice.resetToDefaults"),
    });
  };
  
  const handleRetryApiKey = async () => {
    toast({
      title: t("aiSettings.voice.testingConnection"),
      description: t("aiSettings.voice.verifying")
    });
    
    const success = await retryApiKeyValidation();
    
    if (success) {
      toast({
        title: t("aiSettings.voice.connectionSuccess"),
        description: t("aiSettings.voice.apiKeyValid"),
        variant: "success"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-wakti-blue" />
            {t("aiSettings.voice.title")}
          </CardTitle>
          <CardDescription>
            {t("aiSettings.voice.description")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("aiSettings.voice.recognition")}</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="silence-detection" className="text-sm font-medium">
                  {t("aiSettings.voice.silenceDetection")}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t("aiSettings.voice.silenceDetectionDesc")}
                </p>
              </div>
              <Switch
                id="silence-detection"
                checked={autoSilenceDetection}
                onCheckedChange={toggleAutoSilenceDetection}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="visual-feedback" className="text-sm font-medium">
                  {t("aiSettings.voice.visualFeedback")}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t("aiSettings.voice.visualFeedbackDesc")}
                </p>
              </div>
              <Switch
                id="visual-feedback"
                checked={visualFeedback}
                onCheckedChange={toggleVisualFeedback}
              />
            </div>
            
            {apiKeyStatus === 'invalid' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-amber-800">
                  <RefreshCcw className="h-4 w-4" />
                  {t("aiSettings.voice.connectionIssue")}
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  {apiKeyErrorDetails || t("aiSettings.voice.issueDesc")}
                </p>
                <Button variant="outline" size="sm" onClick={handleRetryApiKey} className="mt-2">
                  {t("aiSettings.voice.testConnection")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t("aiSettings.voice.resetToDefaults")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
