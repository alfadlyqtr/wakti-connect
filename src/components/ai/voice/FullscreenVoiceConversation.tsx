
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Button } from '@/components/ui/button';
import { VoiceSelector } from '@/components/ai/settings/VoiceSelector';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff, X, VolumeX, Volume2, Cog, ArrowLeft, AlertTriangle } from 'lucide-react';
import { AIAssistantMouthAnimation } from '../animation/AIAssistantMouthAnimation';
import { AIVoiceVisualizer } from '../animation/AIVoiceVisualizer';
import { useToast } from '@/hooks/use-toast';

interface FullscreenVoiceConversationProps {
  onClose: () => void;
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading?: boolean;
  lastAssistantMessage?: string;
}

export const FullscreenVoiceConversation: React.FC<FullscreenVoiceConversationProps> = ({
  onClose,
  onSendMessage,
  isChatLoading = false,
  lastAssistantMessage = ''
}) => {
  // State for UI and settings
  const [showSettings, setShowSettings] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Get voice settings from store
  const {
    voice,
    autoSilenceDetection,
    visualFeedback,
    updateVoice,
    toggleAutoSilenceDetection,
    toggleVisualFeedback
  } = useVoiceSettings();

  // Reference to track if we should process the message
  const shouldProcessMessageRef = useRef(false);
  
  // Voice interaction hook with enhanced settings
  const {
    isListening,
    lastTranscript,
    temporaryTranscript,
    isSpeaking,
    supportsVoice,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    isSilent,
    apiKeyStatus,
    retryApiKeyValidation,
    apiKeyErrorDetails
  } = useVoiceInteraction({
    continuousListening: true,
    autoResumeListening: true,
    autoSilenceDetection,
    silenceTime: 1200, // Shorter silence time for more responsive experience
    onTranscriptComplete: (transcript) => {
      if (transcript) {
        console.log("Transcript complete:", transcript);
        setUserMessage(transcript);
        shouldProcessMessageRef.current = true;
      }
    }
  });

  // Process message when transcript is complete and silence is detected
  useEffect(() => {
    if (shouldProcessMessageRef.current && userMessage && isSilent && !isListening && !isChatLoading && !isProcessingResponse) {
      const processUserMessage = async () => {
        setIsProcessingResponse(true);
        shouldProcessMessageRef.current = false;
        setErrorMessage(null);
        
        try {
          console.log("Processing voice message:", userMessage);
          await onSendMessage(userMessage);
          setUserMessage('');
        } catch (error) {
          console.error("Error sending voice message:", error);
          setErrorMessage("Could not process your message. Please try again.");
          toast({
            title: "Message failed",
            description: "Could not process your message. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessingResponse(false);
        }
      };
      
      processUserMessage();
    }
  }, [userMessage, isSilent, isListening, onSendMessage, isChatLoading, isProcessingResponse, toast]);

  // Speak the assistant's response when it's received
  useEffect(() => {
    if (lastAssistantMessage && !isSpeaking && !isChatLoading) {
      console.log("Speaking assistant message:", lastAssistantMessage.substring(0, 50) + "...");
      speakText(lastAssistantMessage);
    }
  }, [lastAssistantMessage, isSpeaking, isChatLoading, speakText]);

  // Start listening when component mounts
  useEffect(() => {
    if (!isListening && supportsVoice && startListening) {
      console.log("Starting voice conversation on mount...");
      const timer = setTimeout(() => {
        try {
          startListening();
        } catch (err) {
          console.error("Error starting listening:", err);
          setErrorMessage("Could not start voice recognition. Your browser may not support this feature.");
          toast({
            title: "Voice Recognition Error",
            description: "Could not start voice recognition. Your browser may not support this feature.",
            variant: "destructive"
          });
        }
      }, 500); // Short delay to ensure all is ready
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (stopListening) stopListening();
      if (stopSpeaking) stopSpeaking();
    };
  }, [isListening, supportsVoice, startListening, stopListening, stopSpeaking, toast]);
  
  // Toggle listening
  const handleToggleMic = useCallback(() => {
    try {
      setErrorMessage(null);
      if (isListening && stopListening) {
        stopListening();
      } else if (startListening) {
        startListening();
      }
    } catch (err) {
      console.error("Error toggling microphone:", err);
      setErrorMessage("Could not toggle microphone. There may be a permissions issue.");
      toast({
        title: "Microphone Error",
        description: "Could not toggle microphone. There may be a permissions issue.",
        variant: "destructive"
      });
    }
  }, [isListening, startListening, stopListening, toast]);

  // Get appropriate status message based on current state
  const getStatusMessage = () => {
    if (errorMessage) {
      return errorMessage;
    } else if (isChatLoading || isProcessingResponse) {
      return "Processing...";
    } else if (isSpeaking) {
      return "WAKTI AI is speaking...";
    } else if (isListening) {
      return temporaryTranscript || "Listening...";
    } else {
      return "Voice conversation active";
    }
  };

  // Handle API key validation retry
  const handleApiKeyRetry = async () => {
    toast({
      title: "Checking OpenAI API key",
      description: "Validating connection to OpenAI services..."
    });
    
    try {
      const success = await retryApiKeyValidation();
      if (success) {
        toast({
          title: "Connection restored",
          description: "Voice features are now available",
          variant: "success"
        });
      }
    } catch (err) {
      console.error("API key validation error:", err);
      toast({
        title: "Connection Failed",
        description: "Could not validate OpenAI connection",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <span className="flex items-center text-sm font-medium text-green-500">
              <Volume2 className="h-4 w-4 mr-1" />
              Speaking
            </span>
          ) : isListening ? (
            <span className="flex items-center text-sm font-medium text-red-500">
              <Mic className="h-4 w-4 mr-1" />
              Listening
            </span>
          ) : (
            <span className="flex items-center text-sm font-medium text-muted-foreground">
              <VolumeX className="h-4 w-4 mr-1" />
              Idle
            </span>
          )}
          
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Cog className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="p-4 border-b bg-muted/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-sm font-medium">Voice Settings</h3>
              
              <VoiceSelector 
                selectedVoice={voice}
                onVoiceChange={updateVoice}
              />
              
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="silence-detection" className="text-sm font-medium">
                    Auto Silence Detection
                  </label>
                  <p className="text-xs text-muted-foreground">
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
                <div>
                  <label htmlFor="visual-feedback" className="text-sm font-medium">
                    Visual Voice Feedback
                  </label>
                  <p className="text-xs text-muted-foreground">
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
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-sm text-amber-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {apiKeyErrorDetails || "There's an issue with the OpenAI API connection. Enhanced voice features may not work properly."}
                    </span>
                  </p>
                  <Button size="sm" variant="outline" onClick={handleApiKeyRetry}>
                    Test API Connection
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className={`h-40 w-40 rounded-full ${isListening ? 'bg-red-50 border-2 border-red-200' : isSpeaking ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'} flex items-center justify-center`}>
            <AIAssistantMouthAnimation 
              isActive={true} 
              isSpeaking={isSpeaking} 
              size="large" 
              mood={isSpeaking ? "happy" : isListening ? "thinking" : "neutral"}
            />
          </div>
          
          {/* Pulsating circles when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-300"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-red-200"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </>
          )}
          
          {/* Pulsating circles when speaking */}
          {isSpeaking && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-300"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-green-200"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </>
          )}
        </div>

        {/* Status message */}
        <div className="max-w-md w-full mx-auto px-4">
          <h3 className="text-center text-lg mb-2">{getStatusMessage()}</h3>
          
          {userMessage && (
            <div className="bg-muted p-4 rounded-lg mb-4 text-center">
              <p className="text-sm">{userMessage}</p>
            </div>
          )}
          
          {/* Voice visualizer when speaking */}
          {isSpeaking && visualFeedback && (
            <div className="mb-8 mt-4">
              <AIVoiceVisualizer isActive={true} isSpeaking={true} />
            </div>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/30 mb-4">
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </p>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              className="rounded-full h-16 w-16 p-0"
              onClick={handleToggleMic}
            >
              {isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            
            {isSpeaking && (
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full h-16 w-16 p-0"
                onClick={stopSpeaking}
              >
                <VolumeX className="h-8 w-8" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-center">
        <Button variant="outline" onClick={onClose}>
          Exit Voice Mode
        </Button>
      </div>
    </motion.div>
  );
};
