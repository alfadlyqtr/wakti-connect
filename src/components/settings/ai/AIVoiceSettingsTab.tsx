
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mic, Volume2, LayoutGrid, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAISettings } from "./context/AISettingsContext";

// Create a temporary store for voice settings to be properly implemented later
const useVoiceSettings = () => {
  const [autoSilenceDetection, setAutoSilenceDetection] = React.useState(true);
  const [visualFeedback, setVisualFeedback] = React.useState(true);
  const [language, setLanguage] = React.useState('en');
  
  const toggleAutoSilenceDetection = () => setAutoSilenceDetection(prev => !prev);
  const toggleVisualFeedback = () => setVisualFeedback(prev => !prev);
  
  return {
    autoSilenceDetection,
    toggleAutoSilenceDetection,
    visualFeedback,
    toggleVisualFeedback,
    language,
    setLanguage
  };
};

export const AIVoiceSettingsTab: React.FC = () => {
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
          Voice Interaction
        </CardTitle>
        <CardDescription>
          Configure your voice input and output preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice_enabled">Enable Voice Input</Label>
            <p className="text-sm text-muted-foreground">
              Allow using voice to interact with the AI assistant
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
            <Label htmlFor="auto_silence">Auto Silence Detection</Label>
            <p className="text-sm text-muted-foreground">
              Automatically stop recording after periods of silence
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
          <Label>Language</Label>
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
            Test Voice Input
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
