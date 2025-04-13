
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { AlertCircle, CheckCircle2, Loader2, Mic, RefreshCw } from "lucide-react";

export const AIVoiceSettingsTab = () => {
  const { 
    supportsVoice, 
    isListening, 
    startListening, 
    stopListening,
    apiKeyStatus,
    retryApiKeyValidation,
    apiKeyErrorDetails 
  } = useVoiceInteraction();
  
  if (!supportsVoice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Features</CardTitle>
          <CardDescription>Configure voice recognition and speech settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your browser does not support the Web Speech API needed for voice features.
              Please try using a modern browser like Chrome, Edge, or Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Features</CardTitle>
        <CardDescription>Configure voice recognition and speech settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Status */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">OpenAI API Connection</h3>
          
          {apiKeyStatus === "valid" ? (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Your OpenAI API key is properly configured and working.
              </AlertDescription>
            </Alert>
          ) : apiKeyStatus === "invalid" ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                {apiKeyErrorDetails || "Your OpenAI API key is invalid or has expired. Please update your API key in the settings."}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={retryApiKeyValidation}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Checking Connection</AlertTitle>
              <AlertDescription>
                Verifying your OpenAI API connection...
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Voice Recognition Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Voice Recognition</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Voice Commands</p>
              <p className="text-sm text-muted-foreground">
                Allow AI assistant to respond to voice commands
              </p>
            </div>
            <Switch checked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voice Activation Keyword</p>
              <p className="text-sm text-muted-foreground">
                Set a keyword to activate voice listening
              </p>
            </div>
            <Switch checked={false} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Continuous Listening</p>
              <p className="text-sm text-muted-foreground">
                Keep microphone active for multiple commands
              </p>
            </div>
            <Switch checked={false} />
          </div>
        </div>
        
        {/* Test Voice Recognition */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium">Test Voice Recognition</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Click the button below to test your microphone and voice recognition
          </p>
          
          <Button 
            onClick={isListening ? stopListening : startListening}
            disabled={apiKeyStatus === "invalid"}
          >
            {isListening ? (
              <>Stop Test</>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Voice Test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIVoiceSettingsTab;
