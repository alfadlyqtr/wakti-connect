
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceSelector } from '@/components/ai/settings/VoiceSelector';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mic, Volume2, AudioWaveform } from 'lucide-react';

export const AIVoiceSettingsTab: React.FC = () => {
  const { 
    voice, 
    autoSilenceDetection, 
    visualFeedback,
    updateVoice,
    toggleAutoSilenceDetection,
    toggleVisualFeedback,
    resetSettings
  } = useVoiceSettings();
  
  const { toast } = useToast();
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "Voice settings have been reset to defaults",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-wakti-blue" />
            Voice Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI assistant speaks and listens
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Voice Selection</h3>
            <VoiceSelector 
              selectedVoice={voice}
              onVoiceChange={updateVoice}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Voice Recognition</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="silence-detection" className="text-sm font-medium">
                  Automatic Silence Detection
                </label>
                <p className="text-sm text-muted-foreground">
                  Automatically stop listening when you pause speaking
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
                  Visual Voice Feedback
                </label>
                <p className="text-sm text-muted-foreground">
                  Show animations when the AI is speaking
                </p>
              </div>
              <Switch
                id="visual-feedback"
                checked={visualFeedback}
                onCheckedChange={toggleVisualFeedback}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
