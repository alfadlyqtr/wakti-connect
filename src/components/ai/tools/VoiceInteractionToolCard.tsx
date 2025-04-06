
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  // Use browser-based speech recognition
  const {
    transcript,
    isListening: browserIsListening,
    startListening: startBrowserListening,
    stopListening: stopBrowserListening,
    resetTranscript,
    supported,
    error: browserError
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
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation,
    language
  } = useVoiceInteraction();
  
  // Combined state for UI
  const isListening = browserIsListening || openAIIsListening;
  
  // Handle API key retry
  const handleApiKeyRetry = async () => {
    setError(null);
    toast({
      title: t("ai.tools.voice.testConnection"),
      description: t("aiSettings.voice.verifying"),
    });
    
    try {
      const success = await retryApiKeyValidation();
      
      if (success) {
        toast({
          title: t("aiSettings.voice.connectionSuccess"),
          description: t("aiSettings.voice.apiKeyValid"),
          variant: "success",
        });
      }
    } catch (err) {
      console.error("API key validation error:", err);
      setError(t("ai.tools.voice.connectionError"));
      toast({
        title: t("ai.tools.voice.apiError"),
        description: t("ai.tools.voice.connectionError"),
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
      setError(browserError);
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
        setError(t("ai.tools.voice.notSupported"));
        toast({
          title: t("ai.tools.voice.notSupported"),
          description: t("ai.tools.voice.notSupported"),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setError(t("ai.tools.voice.apiError"));
      toast({
        title: t("ai.tools.voice.apiError"),
        description: t("ai.tools.voice.apiError"),
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
      
      if (transcribedText.trim()) {
        onSpeechRecognized(transcribedText);
      }
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
      setError(t("ai.tools.voice.apiError"));
    }
  };
  
  const handleUseResult = () => {
    if (transcribedText.trim()) {
      onSpeechRecognized(transcribedText);
    }
  };
  
  const handleReset = () => {
    setTranscribedText("");
    resetTranscript();
    setError(null);
  };
  
  // Get appropriate title class based on compact mode
  const getTitleClass = () => compact ? "text-sm font-medium" : "text-base font-medium";
  
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={getTitleClass()}>{t("ai.tools.voice.title")}</h3>
          {!isListening ? (
            <Button size="sm" onClick={handleStartListening} disabled={isProcessing}>
              {t("ai.tools.voice.startListening")}
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={handleStopListening}>
              {t("ai.tools.voice.stopListening")}
            </Button>
          )}
        </div>
        
        {isListening && (
          <div className="p-2 bg-muted rounded-md text-xs text-center">
            {t("ai.tools.voice.listeningIn", { language: language === 'ar' ? 'العربية' : 'English' })}
          </div>
        )}
        
        {isProcessing && (
          <div className="p-2 bg-muted rounded-md text-xs text-center">
            {t("ai.tools.voice.processingResult")}
          </div>
        )}
        
        {transcribedText && !isListening && !isProcessing && (
          <div className="space-y-2">
            <div className="text-xs border p-2 rounded-md max-h-20 overflow-y-auto">
              {transcribedText}
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={handleReset}>
                {t("ai.tools.voice.tryAgain")}
              </Button>
              <Button size="sm" onClick={handleUseResult}>
                {t("ai.tools.voice.useResult")}
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t("ai.tools.voice.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 items-center justify-center">
          {apiKeyStatus === 'invalid' && (
            <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-md mb-2 text-sm text-amber-800">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{t("aiSettings.voice.connectionIssue")}</span>
              </div>
              <p className="text-xs mb-2">{apiKeyErrorDetails || t("aiSettings.voice.issueDesc")}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleApiKeyRetry} 
                className="bg-white border-amber-300"
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                {t("ai.tools.voice.testConnection")}
              </Button>
            </div>
          )}
          
          {!isListening && !isProcessing && !transcribedText && (
            <Button onClick={handleStartListening} disabled={isProcessing} className="w-full">
              <Mic className="mr-2 h-4 w-4" />
              {t("ai.tools.voice.startListening")}
            </Button>
          )}
          
          {isListening && (
            <>
              <div className="relative w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute w-16 h-16 bg-red-400/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  className="absolute w-12 h-12 bg-red-400/30 rounded-full"
                />
                <Mic className="h-6 w-6 text-red-500 relative z-10" />
              </div>
              
              <p className="text-sm text-center">
                {t("ai.tools.voice.listeningIn", { language: language === 'ar' ? 'العربية' : 'English' })}
              </p>
              
              <Button variant="destructive" onClick={handleStopListening}>
                <Square className="mr-2 h-4 w-4" />
                {t("ai.tools.voice.stopListening")}
              </Button>
            </>
          )}
          
          {isProcessing && (
            <div className="text-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mx-auto"
              >
                <RefreshCcw className="h-8 w-8 text-muted-foreground" />
              </motion.div>
              <p className="mt-2 text-sm">{t("ai.tools.voice.processingResult")}</p>
            </div>
          )}
          
          {transcribedText && !isListening && !isProcessing && (
            <div className="w-full space-y-3">
              <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                {transcribedText}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  {t("ai.tools.voice.tryAgain")}
                </Button>
                <Button onClick={handleUseResult}>
                  {t("ai.tools.voice.useResult")}
                </Button>
              </div>
            </div>
          )}
          
          {error && !apiKeyStatus && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
