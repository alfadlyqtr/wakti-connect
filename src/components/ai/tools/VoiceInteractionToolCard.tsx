
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
  compact?: boolean;
}

export function VoiceInteractionToolCard({ onSpeechRecognized, compact = false }: VoiceInteractionToolCardProps) {
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

  // Compact mode rendering
  if (compact) {
    return (
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-wakti-blue" />
              <span className="text-sm font-medium">Voice to Text</span>
            </div>
            {isListening && (
              <span className="text-xs text-red-500 flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse" />
                Recording...
              </span>
            )}
          </div>
          
          <div className="min-h-[60px] p-2 border rounded-md bg-muted/30 text-xs">
            {transcript || "Speak to convert voice to text..."}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {!isListening ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-wakti-blue text-white hover:bg-wakti-blue/90 transition-colors"
                  onClick={startListening}
                >
                  <Mic className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  onClick={handleStopListening}
                >
                  <Mic className="h-4 w-4" />
                </motion.button>
              )}
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearTranscript}
                disabled={!transcript}
                className="h-8 text-xs px-2"
              >
                Clear
              </Button>
              {transcript && (
                <Button 
                  size="sm"
                  onClick={() => onSpeechRecognized && onSpeechRecognized(transcript)}
                  className="h-8 text-xs px-2"
                >
                  Use
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Regular mode rendering
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
            defaultValue={voiceStyle}
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
