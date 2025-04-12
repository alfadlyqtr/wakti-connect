
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { testEdgeFunction } from '@/integrations/supabase/helper';

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
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access your microphone. Please check permissions.');
    }
  };
  
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
    
    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Wait for the last ondataavailable event
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Test the edge function connection first
      const isConnected = await testEdgeFunction('ai-voice-to-text');
      if (!isConnected) {
        throw new Error('Could not connect to voice transcription service');
      }
      
      // Convert the blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        try {
          // Extract the base64 string (removing data URL prefix)
          const base64data = reader.result?.toString().split(',')[1];
          
          if (!base64data) {
            throw new Error('Failed to convert audio to base64');
          }
          
          console.log('Sending audio to Edge Function for transcription...');
          
          // Call the Supabase Edge Function for transcription
          const { data, error: fnError } = await supabase.functions.invoke('ai-voice-to-text', {
            body: { audio: base64data }
          });
          
          if (fnError) {
            console.error('Edge function error:', fnError);
            throw new Error(`Edge function error: ${fnError.message || 'Unknown error'}`);
          }
          
          if (!data || !data.text) {
            console.error('No transcription returned:', data);
            throw new Error('No transcription returned');
          }
          
          console.log('Transcription received:', data.text);
          onTranscriptReady(data.text);
        } catch (err) {
          console.error('Transcription error:', err);
          toast({
            title: "Transcription Failed",
            description: err instanceof Error ? err.message : "Could not process your recording",
            variant: "destructive"
          });
          setError('Failed to transcribe audio. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };
      
      // Stop the microphone track
      if (mediaRecorderRef.current) {
        const tracks = (mediaRecorderRef.current.stream as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      toast({
        title: "Recording Error",
        description: err instanceof Error ? err.message : "Error processing your voice",
        variant: "destructive"
      });
      setError('Error processing your voice. Please try again.');
      setIsProcessing(false);
    }
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
