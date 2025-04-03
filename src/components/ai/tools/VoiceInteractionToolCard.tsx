
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, Volume2, VolumeX, Loader2, CheckCircle2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

interface VoiceInteractionToolCardProps {
  onSpeechRecognized?: (text: string) => void;
}

export function VoiceInteractionToolCard({ onSpeechRecognized }: VoiceInteractionToolCardProps) {
  const [voiceStyle, setVoiceStyle] = useState<string>("natural");
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
  });

  const handleStopListening = () => {
    stopListening();
    if (transcript && onSpeechRecognized) {
      onSpeechRecognized(transcript);
    }
  };

  const handleClearTranscript = () => {
    resetTranscript();
  };

  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <VolumeX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Speech Recognition Not Supported</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Your browser doesn't support speech recognition features.
              Try using a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="mr-2 h-5 w-5 text-wakti-blue" />
          Voice to Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>Voice Style</Label>
          <RadioGroup 
            value={voiceStyle} 
            onValueChange={setVoiceStyle}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="natural" id="natural-voice" />
              <Label htmlFor="natural-voice">Natural</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="clear" id="clear-voice" />
              <Label htmlFor="clear-voice">Clear & Precise</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 border rounded-md bg-muted/30 min-h-[100px] relative">
          {isListening && (
            <div className="absolute top-2 right-2 flex items-center text-xs text-red-500 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-1" />
              Recording...
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap">
            {transcript || "Speak to convert your voice to text..."}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {!isListening ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-wakti-blue text-white hover:bg-wakti-blue/90 transition-colors"
              onClick={startListening}
              disabled={isListening}
            >
              <Mic className="h-6 w-6" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={handleStopListening}
            >
              <div className="relative">
                <Mic className="h-6 w-6" />
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-white opacity-75"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
            </motion.button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearTranscript}
          disabled={!transcript}
        >
          Clear
        </Button>
        {transcript && (
          <Button 
            size="sm"
            onClick={() => onSpeechRecognized && onSpeechRecognized(transcript)}
          >
            Use Text
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
