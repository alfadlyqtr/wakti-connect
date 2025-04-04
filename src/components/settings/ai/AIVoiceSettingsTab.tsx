
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mic, AudioWaveform, RefreshCcw } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

export const AIVoiceSettingsTab: React.FC = () => {
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
  } = useVoiceInteraction({
    autoResumeListening: false
  });
  
  const handleReset = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "Voice settings have been reset to defaults",
    });
  };
  
  const handleRetryApiKey = async () => {
    toast({
      title: "Testing OpenAI API Connection",
      description: "Please wait while we verify the connection..."
    });
    
    const success = await retryApiKeyValidation();
    
    if (success) {
      toast({
        title: "Connection Successful",
        description: "OpenAI API key is valid for voice recognition features",
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
            Voice Recognition Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI assistant listens
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
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
                  Show animations when voice recognition is active
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
                  OpenAI API Connection Issue
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  {apiKeyErrorDetails || "There's an issue with the OpenAI API connection. Enhanced voice recognition may not be available."}
                </p>
                <Button variant="outline" size="sm" onClick={handleRetryApiKey} className="mt-2">
                  Test API Connection
                </Button>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <AudioWaveform className="h-4 w-4 text-wakti-blue" />
              Voice Recognition Mode
            </h4>
            <p className="text-sm">
              Use voice recognition from the chat interface to convert your speech to text.
              It enables hands-free input with improved voice detection.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Access from the chat interface</p>
              <Button variant="outline" size="sm" className="h-8">
                <Mic className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Try It</span>
              </Button>
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
