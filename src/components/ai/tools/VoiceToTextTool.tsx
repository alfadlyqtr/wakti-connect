
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AIVoiceVisualizer } from "../animation/AIVoiceVisualizer";
import { Mic, MicOff } from "lucide-react";
import { useVoiceSettings } from "@/store/voiceSettings";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { useTranslation } from "react-i18next";

interface VoiceToTextToolProps {
  onUseSummary: (summary: string) => void;
}

export const VoiceToTextTool: React.FC<VoiceToTextToolProps> = ({ onUseSummary }) => {
  const { t } = useTranslation();
  const [voiceResult, setVoiceResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { language } = useVoiceSettings();
  
  const {
    isListening,
    isLoading,
    transcript,
    supportsVoice,
    startListening,
    stopListening,
    lastTranscript
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      setVoiceResult(text);
      setIsProcessing(false);
    }
  });

  const handleStartListening = () => {
    if (supportsVoice) {
      setVoiceResult("");
      startListening();
    }
  };

  const handleStopListening = () => {
    if (isListening) {
      setIsProcessing(true);
      stopListening();
    }
  };

  const handleUseResult = () => {
    if (voiceResult) {
      onUseSummary(voiceResult);
    }
  };

  const handleTryAgain = () => {
    setVoiceResult("");
    handleStartListening();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Mic className="h-5 w-5 mr-2 text-wakti-blue" />
          {t("ai.tools.voice.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!supportsVoice ? (
          <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("ai.tools.voice.notSupported")}
            </p>
          </div>
        ) : isListening ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <AIVoiceVisualizer isActive={true} />
            <p className="text-center text-sm text-muted-foreground">
              {t("ai.tools.voice.listeningIn", { language: language === "en" ? "English" : "العربية" })}
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
        ) : voiceResult ? (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/30 rounded-md max-h-32 overflow-y-auto">
              <p>{voiceResult}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUseResult} className="flex-1">
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
              {t("ai.tools.voice.languageSelection")}: {language === "en" ? "English" : "العربية"}
            </p>
          </div>
        )}
      </CardContent>
      {!isListening && !isProcessing && !voiceResult && supportsVoice && (
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {language === "en" ? "English" : "العربية"}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
