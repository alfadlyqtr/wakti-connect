
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { VoiceRecordingVisualizer } from './VoiceRecordingVisualizer';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface SimplifiedVoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  onCancel: () => void;
  compact?: boolean;
  processAsTask?: boolean;
}

export const SimplifiedVoiceRecorder: React.FC<SimplifiedVoiceRecorderProps> = ({
  onTranscriptReady,
  onCancel,
  compact = false,
  processAsTask = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const timerRef = useRef<number | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { 
    isListening,
    startListening,
    stopListening,
    processAudioWithFallbacks,
    supportsVoice,
    error
  } = useVoiceInteraction();
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Set up audio level monitoring
  const setupAudioLevelMonitoring = (stream: MediaStream) => {
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      
      mediaStreamSource.current = audioContext.current.createMediaStreamSource(stream);
      mediaStreamSource.current.connect(analyser.current);
      
      const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyser.current && isRecording) {
          analyser.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume level (0-1)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length / 255; // Normalize to 0-1
          setAudioLevel(average);
          
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (e) {
      console.error("Error setting up audio monitoring:", e);
    }
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setIsRecording(true);
      setDuration(0);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio level monitoring
      setupAudioLevelMonitoring(stream);
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setDuration(seconds);
        
        // Auto-stop after 60 seconds
        if (seconds >= 60) {
          stopRecording();
        }
      }, 1000);
      
      mediaRecorder.start();
      startListening();
      
    } catch (err) {
      console.error("Error starting recording:", err);
      setIsRecording(false);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Stop recording
  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopListening();
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Clean up audio context
      if (mediaStreamSource.current) {
        mediaStreamSource.current.disconnect();
      }
      if (audioContext.current && audioContext.current.state !== 'closed') {
        await audioContext.current.close();
      }
    }
  };
  
  // Handle the recorded audio
  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) throw new Error("Failed to convert audio to base64");
          
          // Process with server transcription (will use fallbacks if needed)
          const transcript = await processAudioWithFallbacks(base64Audio);
          
          if (transcript) {
            onTranscriptReady(transcript);
          } else {
            toast({
              title: "Transcription Failed",
              description: "Could not convert your speech to text. Please try again.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Transcription error:", error);
          toast({
            title: "Error",
            description: "Failed to process audio. Please try again.",
            variant: "destructive"
          });
        }
      };
    } catch (error) {
      console.error("Error processing recording:", error);
    } finally {
      setIsRecording(false);
      setAudioLevel(0);
    }
  };
  
  // Effects for MediaRecorder events
  useEffect(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        processRecording();
      };
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaStreamSource.current) {
        mediaStreamSource.current.disconnect();
      }
      
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, [mediaRecorderRef.current]);
  
  if (error) {
    return (
      <div className="p-3 border border-red-200 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "rounded-md",
      compact ? "p-2" : "p-4",
      isRecording ? "bg-red-50/50 border border-red-100" : "bg-muted/30"
    )}>
      <div className="flex flex-col gap-3">
        {/* Voice recorder UI */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "relative h-8 w-8 rounded-full flex items-center justify-center",
              isRecording ? "bg-red-500 text-white" : "bg-muted"
            )}>
              <Mic className="h-4 w-4" />
              {isRecording && (
                <span className="absolute -top-1 -right-1 h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            
            <div>
              <p className={cn(
                "text-sm font-medium",
                isRecording ? "text-red-600" : "text-foreground"
              )}>
                {isRecording ? "Recording..." : "Voice to Text"}
              </p>
              
              {isRecording && (
                <p className="text-xs text-muted-foreground">
                  {formatDuration(duration)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Button
                size="sm"
                variant="destructive"
                className="h-8"
                onClick={stopRecording}
              >
                <Square className="h-3.5 w-3.5 mr-1" />
                Stop
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                
                <Button
                  size="sm"
                  className="h-8"
                  onClick={startRecording}
                >
                  <Mic className="h-3.5 w-3.5 mr-1" />
                  Record
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Audio visualizer */}
        {isRecording && (
          <VoiceRecordingVisualizer 
            isActive={isRecording}
            audioLevel={audioLevel}
            size={compact ? "sm" : "md"}
          />
        )}
        
        {/* Instructions */}
        {!isRecording && !compact && (
          <p className="text-xs text-muted-foreground">
            Click record and speak clearly. Recording will automatically stop after 60 seconds.
          </p>
        )}
      </div>
    </div>
  );
};
