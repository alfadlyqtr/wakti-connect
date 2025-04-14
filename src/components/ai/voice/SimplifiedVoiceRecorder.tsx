
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { testEdgeFunction } from '@/integrations/supabase/helper';
import { parseTaskWithAI } from '@/services/ai/aiTaskParserService';

interface SimplifiedVoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  onCancel: () => void;
  compact?: boolean;
  processAsTask?: boolean;
  onTaskParsed?: (taskData: any) => void;
}

export const SimplifiedVoiceRecorder: React.FC<SimplifiedVoiceRecorderProps> = ({
  onTranscriptReady,
  onCancel,
  compact = false,
  processAsTask = false,
  onTaskParsed
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
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Specify WebM format explicitly
      });
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
      console.log(`Audio recorded: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
      
      // Try ElevenLabs first
      try {
        const elevenLabsTranscript = await transcribeWithElevenLabs(audioBlob);
        if (elevenLabsTranscript) {
          console.log('Using ElevenLabs transcription:', elevenLabsTranscript);
          await processTranscription(elevenLabsTranscript);
          return;
        }
      } catch (elevenLabsErr) {
        console.warn('ElevenLabs transcription failed, falling back to Whisper:', elevenLabsErr);
      }
      
      // Fall back to Whisper if ElevenLabs fails
      try {
        const whisperTranscript = await transcribeWithWhisper(audioBlob);
        if (whisperTranscript) {
          console.log('Using Whisper transcription:', whisperTranscript);
          await processTranscription(whisperTranscript);
          return;
        }
      } catch (whisperErr) {
        console.warn('Whisper transcription failed, falling back to browser:', whisperErr);
      }
      
      // If both APIs fail, use browser transcription as a last resort
      try {
        const browserTranscript = await transcribeWithBrowserAPI(audioBlob);
        if (browserTranscript) {
          console.log('Using browser transcription:', browserTranscript);
          await processTranscription(browserTranscript);
          return;
        }
      } catch (browserErr) {
        console.error('Browser transcription failed too:', browserErr);
        toast({
          title: "Transcription Failed",
          description: "All transcription methods failed. Please try again or type manually.",
          variant: "destructive"
        });
        setError('Failed to transcribe audio. Please try again.');
        setIsProcessing(false);
      }
      
      // Stop all audio tracks
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
  
  // Transcribe with ElevenLabs - Primary method
  const transcribeWithElevenLabs = async (audioBlob: Blob): Promise<string | null> => {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Call edge function for ElevenLabs transcription
      const { data, error } = await supabase.functions.invoke('elevenlabs-speech-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      return data?.text || null;
    } catch (error) {
      console.error('ElevenLabs transcription error:', error);
      return null;
    }
  };
  
  // Transcribe with Whisper via Edge Function - Fallback #1
  const transcribeWithWhisper = async (audioBlob: Blob): Promise<string | null> => {
    try {
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Call the Supabase Edge Function with Whisper
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      return data?.text || null;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      return null;
    }
  };
  
  // Transcribe with browser API - Final fallback
  const transcribeWithBrowserAPI = async (audioBlob: Blob): Promise<string | null> => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }
    
    // This is a placeholder - the Web Speech API doesn't actually work with audio blobs
    // In a real implementation, this would use another approach
    return "Sorry, browser speech recognition couldn't process your recording.";
  };
  
  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Process the transcription, optionally as a task
  const processTranscription = async (text: string) => {
    try {
      if (processAsTask && onTaskParsed) {
        // Process as a structured task using AI
        console.log("Processing transcription as task:", text);
        
        // Send to our AI task parser
        const parsedTask = await parseTaskWithAI(text);
        
        if (parsedTask) {
          console.log("Task parsed successfully:", parsedTask);
          onTaskParsed(parsedTask);
        } else {
          // Fallback: still provide the raw text even if parsing failed
          onTranscriptReady(text);
        }
      } else {
        // Just return the transcription as-is
        onTranscriptReady(text);
      }
    } catch (err) {
      console.error("Error processing transcription:", err);
      // Fallback to raw text
      onTranscriptReady(text);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Compact view for inline usage
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
  
  // Full view for standalone usage
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
