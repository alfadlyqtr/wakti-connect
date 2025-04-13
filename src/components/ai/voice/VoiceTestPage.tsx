
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { Loader2, Mic, MicOff, RefreshCw } from 'lucide-react';
import { VoiceRecordingVisualizer } from './VoiceRecordingVisualizer';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const VoiceTestPage = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    supportsVoice,
    error,
    apiKeyStatus,
    retryApiKeyValidation,
    apiKeyErrorDetails
  } = useVoiceInteraction();

  // Render different states based on voice support and API status
  if (!supportsVoice) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Voice Recognition Not Supported</CardTitle>
          <CardDescription>
            Your browser doesn't support the Web Speech API required for voice recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Try using a modern browser like Chrome, Edge, or Safari for the best experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Display API key validation status
  const renderApiKeyStatus = () => {
    if (apiKeyStatus === "valid") {
      return (
        <Alert variant="default" className="bg-green-50 border-green-200 mb-4">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>OpenAI API Key Valid</AlertTitle>
          <AlertDescription>
            Your OpenAI API key is properly configured and working.
          </AlertDescription>
        </Alert>
      );
    } else if (apiKeyStatus === "invalid") {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid OpenAI API Key</AlertTitle>
          <AlertDescription>
            {apiKeyErrorDetails || "Your OpenAI API key is invalid or expired. Please check your settings."}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={retryApiKeyValidation}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Validation
            </Button>
          </AlertDescription>
        </Alert>
      );
    } else if (apiKeyStatus === "unknown") {
      return (
        <Alert variant="default" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>API Key Status Unknown</AlertTitle>
          <AlertDescription>
            We couldn't determine if your OpenAI API key is valid.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={retryApiKeyValidation}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check API Key
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Voice Recognition Test</CardTitle>
            <CardDescription>
              Test voice recognition capabilities in your browser
            </CardDescription>
          </div>
          <Badge variant={isListening ? "default" : "outline"}>
            {isListening ? "Listening..." : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderApiKeyStatus()}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-lg p-4 min-h-32 bg-muted/30">
          {transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-muted-foreground">Your transcribed speech will appear here...</p>
          )}
        </div>
        
        <div className="h-16 flex items-center justify-center">
          {isListening && <VoiceRecordingVisualizer />}
        </div>
        
        <div className="flex justify-center gap-4">
          {!isListening ? (
            <Button onClick={startListening} disabled={apiKeyStatus === "invalid"}>
              <Mic className="mr-2 h-5 w-5" />
              Start Listening
            </Button>
          ) : (
            <Button onClick={stopListening} variant="secondary">
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-5 w-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTestPage;
