
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { VoiceRecordingVisualizer } from '@/components/ai/voice/VoiceRecordingVisualizer';

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
  compact?: boolean;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({
  onSpeechRecognized,
  compact = false
}) => {
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use browser-based speech recognition
  const {
    transcript,
    temporaryTranscript,
    confirmTranscript,
    isListening: browserIsListening,
    startListening: startBrowserListening,
    stopListening: stopBrowserListening,
    resetTranscript,
    audioLevel: browserAudioLevel,
    supported,
    error: browserError,
    processing: browserProcessing
  } = useSpeechRecognition({
    continuous: false,
    interimResults: false
  });
  
  // Use OpenAI based voice interaction
  const {
    lastTranscript,
    isListening: openAIIsListening,
    startListening: startOpenAIListening,
    stopListening: stopOpenAIListening,
    isProcessing: openAIProcessing,
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction();
  
  // Combined state for UI
  const isListening = browserIsListening || openAIIsListening;
  const isProcessing = browserProcessing || openAIProcessing;
  
  // Handle API key retry
  const handleApiKeyRetry = async () => {
    setError(null);
    toast({
      title: "Testing OpenAI API Key",
      description: "Checking if the OpenAI API key is properly configured...",
    });
    
    try {
      const success = await retryApiKeyValidation();
      
      if (success) {
        toast({
          title: "OpenAI API Key Valid",
          description: "Voice-to-text features are available.",
          variant: "success",
        });
      }
    } catch (err) {
      console.error("API key validation error:", err);
      setError("Could not validate API key connection");
      toast({
        title: "Connection Failed",
        description: "Could not validate OpenAI connection",
        variant: "destructive"
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
  
  // Update error state if browser recognition has an error
  useEffect(() => {
    if (browserError) {
      setError(browserError.message || "Speech recognition error");
    }
  }, [browserError]);
  
  const handleStartListening = () => {
    resetTranscript();
    setTranscribedText("");
    setError(null);
    
    try {
      // Try OpenAI voice first if configured
      if (apiKeyStatus === 'valid' && startOpenAIListening) {
        console.log("Starting OpenAI voice recognition");
        startOpenAIListening();
      } else if (supported && startBrowserListening) {
        // Fall back to browser-based recognition
        console.log("Falling back to browser-based speech recognition");
        startBrowserListening();
      } else {
        console.error("No speech recognition method available");
        setError("Speech recognition is not available in your browser");
        toast({
          title: "Speech Recognition Unavailable",
          description: "Neither OpenAI nor browser-based speech recognition is available.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setError(`Speech recognition error: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Speech Recognition Error",
        description: "Failed to start speech recognition",
        variant: "destructive",
      });
    }
  };
  
  const handleStopListening = async () => {
    try {
      if (openAIIsListening && stopOpenAIListening) {
        console.log("Stopping OpenAI speech recognition");
        await stopOpenAIListening();
      } else if (browserIsListening && stopBrowserListening) {
        console.log("Stopping browser-based speech recognition");
        stopBrowserListening();
      }
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
      setError(`Error stopping speech recognition: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Error",
        description: "Failed to stop speech recognition",
        variant: "destructive",
      });
    }
  };
  
  const handleConfirmTranscript = () => {
    if (confirmTranscript && temporaryTranscript) {
      confirmTranscript();
      
      if (temporaryTranscript.trim()) {
        onSpeechRecognized(temporaryTranscript);
        toast({
          title: "Voice transcription complete",
          description: "Your spoken text has been processed",
        });
      }
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
          <div className="flex items-center gap-1">
            {temporaryTranscript && !isListening && !isProcessing && (
              <Button 
                variant="success"
                size="sm"
                className="h-7 w-7 text-xs rounded-full p-0"
                onClick={handleConfirmTranscript}
              >
                <motion.div
                  animate={{ scale: [0.9, 1, 0.9] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ✓
                </motion.div>
              </Button>
            )}
            <Button 
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="h-7 text-xs"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={isProcessing}
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
        </div>
        
        {isListening && (
          <div className="flex justify-center">
            <VoiceRecordingVisualizer
              isActive={isListening}
              audioLevel={browserAudioLevel}
              size="sm"
              className="w-full"
            />
          </div>
        )}
        
        {temporaryTranscript && !isListening && !isProcessing && (
          <p className="text-xs italic bg-blue-50 border border-blue-100 p-2 rounded-md">
            {temporaryTranscript}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-destructive">
            {error}
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-wakti-blue" />
          Voice Recognition
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
        
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md border border-destructive/30">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <motion.div
            initial={false}
            animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
            className="relative"
          >
            <Button 
              onClick={isListening ? handleStopListening : handleStartListening}
              variant={isListening ? "destructive" : "default"}
              className={cn("relative", isListening && "border-4 border-red-200")}
              size="lg"
              disabled={isProcessing}
            >
              {isListening ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
            
            {isListening && (
              <motion.div
                className="absolute -inset-2 rounded-md border-2 border-red-400"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </div>
        
        <div className="rounded-md bg-muted/50 relative overflow-hidden">
          {isListening && (
            <div className="p-4 flex justify-center">
              <VoiceRecordingVisualizer
                isActive={isListening}
                audioLevel={browserAudioLevel}
                size="lg"
                className="w-full max-w-md"
              />
            </div>
          )}
          
          {temporaryTranscript && !isListening && !isProcessing && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm mb-2">{temporaryTranscript}</p>
              <div className="flex justify-end">
                <Button 
                  variant="success" 
                  onClick={handleConfirmTranscript}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [0.9, 1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ✓
                  </motion.div>
                  <span>Confirm Transcript</span>
                </Button>
              </div>
            </div>
          )}
          
          {!isListening && !temporaryTranscript && !isProcessing && (
            <div className="p-4">
              <p className="text-muted-foreground text-center">
                Click "Start Recording" and speak. When you stop recording, your words will be transcribed.
              </p>
            </div>
          )}
          
          {isProcessing && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-amber-700 text-center flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCcw className="h-4 w-4" />
                </motion.div>
                <span>Processing your voice...</span>
              </p>
            </div>
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

// Helper function to conditionally join classNames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
