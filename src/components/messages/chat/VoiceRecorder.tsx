
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioDuration: string) => void;
  onCancel: () => void;
  maxDuration?: number; // in seconds
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  maxDuration = 30
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, formatDuration(duration));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setDuration(seconds);
        
        // Auto stop when max duration is reached
        if (seconds >= maxDuration) {
          stopRecording();
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop and release the stream
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    }
  };
  
  // Cancel recording
  const handleCancel = () => {
    stopRecording();
    onCancel();
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium flex items-center gap-1">
          {isRecording ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Voice Message
            </>
          )}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatDuration(duration)}/{formatDuration(maxDuration)}
        </span>
      </div>
      
      <Progress value={(duration / maxDuration) * 100} className="h-1" />
      
      <div className="flex items-center gap-2 justify-end mt-2">
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        
        {isRecording ? (
          <Button 
            size="sm" 
            variant="destructive"
            onClick={stopRecording}
            className="gap-1"
          >
            <Square className="h-3 w-3" />
            Stop
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={startRecording}
            className="gap-1"
          >
            <Mic className="h-3 w-3" />
            Start
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
