
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Settings } from "lucide-react";
import { AIVoiceVisualizer } from "../animation/AIVoiceVisualizer";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { useVoiceSettings } from "@/store/voiceSettings";
import { useTranslation } from "react-i18next";

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({
  onSpeechRecognized
}) => {
  const { t } = useTranslation();
  const [voiceText, setVoiceText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { language } = useVoiceSettings();
  
  const {
    isListening,
    isLoading,
    transcript,
    lastTranscript,
    supportsVoice,
    startListening,
    stopListening,
    apiKeyStatus,
    language: currentLanguage
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      setVoiceText(text);
      setIsProcessing(false);
    },
    continuousListening: true
  });

  const handleStartListening = () => {
    setVoiceText("");
    startListening();
  };

  const handleStopListening = () => {
    setIsProcessing(true);
    stopListening();
  };

  const handleUseText = () => {
    if (voiceText) {
      onSpeechRecognized(voiceText);
    }
  };

  const handleTryAgain = () => {
    setVoiceText("");
    handleStartListening();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-wakti-blue" />
          {t("ai.tools.voice.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!supportsVoice ? (
          <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("ai.tools.voice.notSupported")}
            </p>
          </div>
        ) : apiKeyStatus === 'invalid' ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 border border-dashed rounded-lg">
            <p className="text-sm text-destructive">
              {t("ai.tools.voice.apiError")}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/settings/ai">
                <Settings className="h-4 w-4 mr-2" />
                {t("ai.tools.voice.testConnection")}
              </a>
            </Button>
          </div>
        ) : isListening ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <AIVoiceVisualizer isActive={true} />
            <p className="text-center text-sm text-muted-foreground">
              {t("ai.tools.voice.listeningIn", { language: currentLanguage === "en" ? "English" : "العربية" })}
            </p>
            {transcript && (
              <div className="w-full p-3 bg-secondary/30 rounded-md max-h-24 overflow-y-auto">
                <p className="text-sm">{transcript}</p>
              </div>
            )}
            <Button 
              variant="destructive" 
              className="mt-2" 
              onClick={handleStopListening}
            >
              <MicOff className="h-4 w-4 mr-2" />
              {t("ai.tools.voice.stopListening")}
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="animate-pulse">
              <div className="h-8 w-8 rounded-full bg-wakti-blue/20 flex items-center justify-center">
                <Mic className="h-4 w-4 text-wakti-blue" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t("ai.tools.voice.processingResult")}
            </p>
          </div>
        ) : voiceText ? (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/30 rounded-md max-h-32 overflow-y-auto">
              <p>{voiceText}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUseText} className="flex-1">
                {t("ai.tools.voice.useResult")}
              </Button>
              <Button variant="outline" onClick={handleTryAgain}>
                {t("ai.tools.voice.tryAgain")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Button onClick={handleStartListening}>
              <Mic className="h-4 w-4 mr-2" />
              {t("ai.tools.voice.startListening")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {t("ai.tools.voice.languageSelection")}: {currentLanguage === "en" ? "English" : "العربية"}
            </p>
          </div>
        )}
      </CardContent>
      {!isListening && !isProcessing && !voiceText && supportsVoice && (
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {currentLanguage === "en" ? "English" : "العربية"}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
