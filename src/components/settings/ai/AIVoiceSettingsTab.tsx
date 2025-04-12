
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Mic, RefreshCcw } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AIVoiceSettingsTab: React.FC = () => {
  const { 
    autoSilenceDetection, 
    visualFeedback,
    language,
    toggleAutoSilenceDetection,
    toggleVisualFeedback,
    setLanguage,
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
            Configure how the AI assistant listens and responds to your voice
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
            
            <div className="space-y-2">
              <label htmlFor="language-select" className="text-sm font-medium">
                Voice Recognition Language
              </label>
              <p className="text-sm text-muted-foreground mb-2">
                Select the language for voice recognition
              </p>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {apiKeyStatus === 'invalid' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-amber-800">
                  <RefreshCcw className="h-4 w-4" />
                  OpenAI API Connection Issue
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  {apiKeyErrorDetails || "There's an issue with the OpenAI API key. Enhanced voice recognition features are unavailable."}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApiKeyRetry}
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  Retry Connection
                </Button>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Voice processing for WAKTI Assistant can now use OpenAI Whisper for enhanced recognition. 
              Your voice is only processed after you finish speaking, and you can edit the transcription 
              before sending.
            </p>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset to Defaults
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Voice Recognition Features</CardTitle>
          <CardDescription>
            Enhanced voice features now available
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="bg-green-100 p-1 rounded-full text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Complete Voice Recording</h4>
              <p className="text-xs text-muted-foreground">
                Records your full message before processing, no more live transcription
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-green-100 p-1 rounded-full text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Post-Record Controls</h4>
              <p className="text-xs text-muted-foreground">
                Edit, retry, or send transcription after recording
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-green-100 p-1 rounded-full text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Multilingual Support</h4>
              <p className="text-xs text-muted-foreground">
                Added support for multiple languages (English, Arabic, and more)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
