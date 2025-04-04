import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceSelector } from '@/components/ai/settings/VoiceSelector';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mic, Volume2, AudioWaveform, RefreshCcw } from 'lucide-react';
import { AIAssistantMouthAnimation } from '@/components/ai/animation/AIAssistantMouthAnimation';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

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
  
  const {
    speakText,
    stopSpeaking,
    isSpeaking,
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
  
  const handleTestVoice = () => {
    speakText("Hello! This is a test of the AI voice feature with the " + voice + " voice.");
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
        description: "OpenAI API key is valid for voice features",
        variant: "success"
      });
    }
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
          <div className="flex flex-col md:flex-row gap-6 md:items-center mb-4">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <AIAssistantMouthAnimation 
                  isActive={true} 
                  isSpeaking={isSpeaking} 
                  size="medium" 
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">Voice Preview</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={handleTestVoice}
                disabled={isSpeaking}
              >
                {isSpeaking ? "Speaking..." : "Test Voice"}
              </Button>
            </div>
            
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-medium">Voice Selection</h3>
              <VoiceSelector 
                selectedVoice={voice}
                onVoiceChange={updateVoice}
              />
              <p className="text-xs text-muted-foreground">
                Choose the voice that best suits your preference. Different voices have different tones and personalities.
              </p>
            </div>
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
            
            {apiKeyStatus === 'invalid' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-amber-800">
                  <RefreshCcw className="h-4 w-4" />
                  OpenAI API Connection Issue
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  {apiKeyErrorDetails || "There's an issue with the OpenAI API connection. Voice features may be limited."}
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
              Voice Conversation Mode
            </h4>
            <p className="text-sm">
              Enter the immersive voice conversation mode from the chat interface. 
              It enables a hands-free experience with improved voice detection and speaking animations.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Access from the "Voice Conversation" button in chat</p>
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
