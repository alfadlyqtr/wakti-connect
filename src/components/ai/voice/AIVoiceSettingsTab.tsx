
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mic, Volume2, LayoutGrid, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAISettings } from "@/components/settings/ai/context/AISettingsContext";
import { useVoiceSettings } from "@/store/voiceSettings";
import { useTranslation } from "react-i18next";

export const AIVoiceSettingsTab: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, isUpdatingSettings } = useAISettings();
  const {
    autoSilenceDetection,
    toggleAutoSilenceDetection,
    visualFeedback,
    toggleVisualFeedback,
    language,
    setLanguage
  } = useVoiceSettings();
  
  if (!settings) return null;

  return (
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
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice_enabled">{t("aiSettings.voice.enableVoice")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("aiSettings.voice.enableDescription")}
            </p>
          </div>
          <Switch
            id="voice_enabled"
            checked={visualFeedback}
            onCheckedChange={toggleVisualFeedback}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto_silence">{t("aiSettings.voice.autoSilence")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("aiSettings.voice.autoSilenceDescription")}
            </p>
          </div>
          <Switch
            id="auto_silence"
            checked={autoSilenceDetection}
            onCheckedChange={toggleAutoSilenceDetection}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>{t("aiSettings.voice.language")}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              variant={language === 'es' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('es')}
            >
              Spanish
            </Button>
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('fr')}
            >
              French
            </Button>
            <Button
              variant={language === 'de' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('de')}
            >
              German
            </Button>
            <Button
              variant={language === 'ar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('ar')}
            >
              Arabic
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open('/voice-test', '_blank')}
          >
            <Mic className="mr-2 h-4 w-4" />
            {t("aiSettings.voice.testVoice")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
