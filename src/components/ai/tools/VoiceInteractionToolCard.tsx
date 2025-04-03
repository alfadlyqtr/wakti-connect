
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
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
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true
  });
  
  React.useEffect(() => {
    if (transcript) {
      setTranscribedText(transcript);
    }
  }, [transcript]);
  
  const handleStartListening = () => {
    resetTranscript();
    setTranscribedText("");
    startListening();
  };
  
  const handleStopListening = () => {
    stopListening();
    if (transcribedText.trim()) {
      onSpeechRecognized(transcribedText);
    }
  };
  
  if (!supported) {
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
