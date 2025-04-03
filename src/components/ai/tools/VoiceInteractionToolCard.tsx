
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Volume2, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
  compact?: boolean;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({
  onSpeechRecognized,
  compact = false
}) => {
  const [transcribedText, setTranscribedText] = useState("");
  const { toast } = useToast();
  
  // Use browser-based speech recognition
  const {
    transcript,
    isListening: browserIsListening,
    startListening: startBrowserListening,
    stopListening: stopBrowserListening,
    resetTranscript,
    supported
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true
  });
  
  // Use OpenAI based voice interaction
  const {
    lastTranscript,
    isListening: openAIIsListening,
    startListening: startOpenAIListening,
    stopListening: stopOpenAIListening,
    isProcessing,
    supportsVoice,
    isSpeaking,
    canUseSpeechSynthesis,
    openAIVoiceSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction();
  
  // Combined state for UI
  const isListening = browserIsListening || openAIIsListening;
  
  const handleApiKeyRetry = async () => {
    toast({
      title: "Testing OpenAI API Key",
      description: "Checking if the OpenAI API key is properly configured...",
    });
    
    const success = await retryApiKeyValidation();
    
    if (success) {
      toast({
        title: "OpenAI API Key Valid",
        description: "Enhanced voice features are available.",
        variant: "success",
      });
    }
  };
  
  // Update transcript from browser-based recognition
  useEffect(() => {
    if (transcript) {
      setTranscribedText(transcript);
    }
  }, [transcript]);
  
  // Update transcript from OpenAI-based recognition
  useEffect(() => {
    if (lastTranscript) {
      setTranscribedText(lastTranscript);
    }
  }, [lastTranscript]);
  
  const handleStartListening = () => {
    resetTranscript();
    setTranscribedText("");
    
    // Try OpenAI voice first if configured
    if (openAIVoiceSupported) {
      console.log("Starting OpenAI voice recognition");
      startOpenAIListening();
    } else if (supported) {
      // Fall back to browser-based recognition
      console.log("Falling back to browser-based speech recognition");
      startBrowserListening();
    } else {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Neither OpenAI nor browser-based speech recognition is available.",
        variant: "destructive",
      });
    }
  };
  
  const handleStopListening = async () => {
    if (openAIIsListening) {
      await stopOpenAIListening();
    } else if (browserIsListening) {
      stopBrowserListening();
    }
    
    if (transcribedText.trim()) {
      onSpeechRecognized(transcribedText);
    }
  };
  
  const voiceSupported = supported || supportsVoice;
  
  if (!voiceSupported) {
    return compact ? (
      <div className="text-xs text-muted-foreground p-2 border rounded-md">
        Speech recognition is not supported in your browser.
      </div>
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>Voice Interaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Speech recognition is not supported in your browser.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const renderApiKeyStatus = () => {
    if (apiKeyStatus === 'invalid') {
      return (
        <div className="flex items-center text-amber-600 mb-2">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">OpenAI API Key Issue</p>
            <p className="text-xs">{apiKeyErrorDetails || "API key not configured or invalid"}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-1 h-7 text-xs" 
              onClick={handleApiKeyRetry}
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Retry API Key Check
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Voice Input</span>
          <Button 
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className="h-7 text-xs"
            onClick={isListening ? handleStopListening : handleStartListening}
          >
            {isListening ? (
              <>
                <Square className="h-3 w-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Speak
              </>
            )}
          </Button>
        </div>
        
        {isListening && (
          <p className="text-xs italic">
            {transcribedText || "Listening..."}
          </p>
        )}
        
        {apiKeyStatus === 'invalid' && (
          <div className="text-xs flex items-center text-amber-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Using browser voice (OpenAI unavailable)
            <Button
              variant="ghost"
              size="sm"
              className="h-5 ml-1 px-1"
              onClick={handleApiKeyRetry}
            >
              <RefreshCcw className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // Regular (non-compact) UI
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-wakti-blue" />
          Voice Interaction
          {apiKeyStatus === 'invalid' && (
            <span className="text-xs text-amber-600 font-normal flex items-center ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Enhanced voice features unavailable
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderApiKeyStatus()}
        
        <div className="flex justify-center">
          <Button 
            onClick={isListening ? handleStopListening : handleStartListening}
            variant={isListening ? "destructive" : "default"}
            className="relative"
            size="lg"
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Listening
                <motion.div
                  className="absolute inset-0 rounded-md border-2 border-red-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
        </div>
        
        <div className={`rounded-md p-3 bg-muted/50 min-h-[100px] relative ${isListening ? 'border-2 border-primary' : 'border border-border'}`}>
          {isListening && !transcribedText && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Listening...</p>
            </div>
          )}
          {transcribedText && (
            <p className="text-sm">{transcribedText}</p>
          )}
          {!isListening && !transcribedText && (
            <p className="text-muted-foreground text-center">
              Click "Start Listening" and speak. Your words will appear here.
            </p>
          )}
        </div>
        
        {apiKeyStatus === 'invalid' && (
          <div className="text-sm bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700">
            <p className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                Using browser-based speech recognition. For enhanced voice features, ensure the OpenAI API key is set correctly in Supabase secrets.
              </span>
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleApiKeyRetry}
              className="text-xs"
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Retry API Key Check
            </Button>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="secondary" 
            onClick={() => {
              if (transcribedText.trim()) {
                onSpeechRecognized(transcribedText);
                toast({
                  title: "Text sent to chat",
                  description: "Your spoken text has been sent to the chat",
                });
                setTranscribedText("");
                resetTranscript();
              }
            }}
            disabled={!transcribedText.trim()}
          >
            Use in Conversation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
