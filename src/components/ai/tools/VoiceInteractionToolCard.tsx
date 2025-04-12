
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, RefreshCcw, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { motion } from 'framer-motion';

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({ onSpeechRecognized }) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Get speech recognition utilities
  const {
    isRecording,
    startRecording,
    stopRecording,
    transcript: recognizedTranscript,
    error: recognitionError,
    isProcessing,
    supported,
    temporaryTranscript,
    confirmTranscript,
    audioLevel = 0
  } = useSpeechRecognition({
    silenceThreshold: 0.02,
    silenceTimeout: 1500
  });
  
  // Update transcript with recognized speech
  useEffect(() => {
    if (recognizedTranscript && !isRecording) {
      setTranscript(recognizedTranscript);
    }
  }, [recognizedTranscript, isRecording]);
  
  // Handle error from speech recognition
  useEffect(() => {
    if (recognitionError) {
      setError(recognitionError.message);
    }
  }, [recognitionError]);
  
  const handleSubmit = () => {
    if (!transcript.trim()) {
      setError('No speech detected');
      return;
    }
    
    onSpeechRecognized(transcript.trim());
    setTranscript('');
  };
  
  // Render audio visualizer
  const renderAudioBars = () => {
    if (!isRecording) return null;
    
    const bars = 5;
    const levelHeight = audioLevel * 20;
    
    return (
      <div className="flex items-end justify-center h-12 gap-1 mt-4">
        {Array.from({ length: bars }).map((_, i) => {
          const barHeight = Math.min(40, Math.max(3, levelHeight - (Math.abs(i - bars / 2) * 5)));
          
          return (
            <motion.div
              key={i}
              className="bg-wakti-blue w-1.5 rounded-full"
              animate={{ height: barHeight }}
              transition={{ duration: 0.1 }}
              style={{ minHeight: 3 }}
            />
          );
        })}
      </div>
    );
  };
  
  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice to Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unfortunately, your browser doesn't support voice recognition.
            Please try using Chrome, Edge, or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-wakti-blue" />
          Voice to Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-md p-3 min-h-24 text-sm relative">
          {isRecording ? (
            <div className="italic text-muted-foreground">
              {temporaryTranscript || "Listening..."}
            </div>
          ) : transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-muted-foreground">
              Click the microphone button and speak to convert your voice to text...
            </p>
          )}
          
          {isProcessing && !isRecording && (
            <div className="absolute right-3 top-3">
              <RefreshCcw className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
        
        {renderAudioBars()}
        
        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
        
        <div className="flex gap-2 justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={isRecording ? "bg-red-100 border-red-300" : ""}
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                setError(null);
                startRecording();
              }
            }}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!transcript.trim()}
          >
            Use Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
