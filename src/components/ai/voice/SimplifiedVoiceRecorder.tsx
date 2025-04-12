
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimplifiedVoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  onCancel: () => void;
  compact?: boolean;
}

export const SimplifiedVoiceRecorder: React.FC<SimplifiedVoiceRecorderProps> = ({
  onTranscriptReady,
  onCancel,
  compact = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access your microphone. Please check permissions.');
    }
  };
  
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    
    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Wait for the last ondataavailable event
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Simple browser-based speech recognition
      const transcription = await processAudioWithBrowserAPI(audioBlob);
      onTranscriptReady(transcription);
      setIsProcessing(false);
      
      // Stop the microphone track
      if (mediaRecorderRef.current) {
        const tracks = (mediaRecorderRef.current.stream as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Error processing your voice. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const processAudioWithBrowserAPI = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      // This is a simplified version - in a real implementation, 
      // you would use an actual speech recognition service
      // Here we're just simulating with a timeout
      setTimeout(() => {
        resolve("This is a test transcription of what you said. In production, this would be the result from a real speech-to-text service.");
      }, 1500);
    });
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isProcessing ? (
          <div className="flex-1 text-center py-2">
            <Loader2 className="animate-spin h-5 w-5 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Processing audio...</p>
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size={isRecording ? "default" : "icon"}
              onClick={isRecording ? stopRecording : startRecording}
              className={cn("h-9 w-9", isRecording && "w-auto gap-2")}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            {isRecording && (
              <div className="flex-1 text-xs text-muted-foreground">
                Recording... Click stop when finished.
              </div>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-9 px-2 text-xs"
            >
              Cancel
            </Button>
          </>
        )}
        
        {error && (
          <p className="text-destructive text-xs">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording...
            </span>
          ) : isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Input
            </span>
          )}
        </span>
      </div>
      
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
