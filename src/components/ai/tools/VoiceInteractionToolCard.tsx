
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({ onSpeechRecognized }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
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
          const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
            body: { audio: base64data }
          });
          
          if (error) {
            throw new Error(`Edge function error: ${error.message}`);
          }
          
          if (!data.text) {
            throw new Error('No transcription returned');
          }
          
          console.log('Transcription received:', data.text);
          setTranscript(data.text);
          setIsProcessing(false);
        } catch (err) {
          console.error('Transcription error:', err);
          toast({
            title: "Transcription Failed",
            description: err instanceof Error ? err.message : "Could not process your recording",
            variant: "destructive"
          });
          setError('Failed to transcribe audio. Please try again.');
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
      setError('Error processing your voice. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const handleSubmit = () => {
    if (transcript) {
      onSpeechRecognized(transcript);
      setTranscript('');
    }
  };
  
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
            <div className="italic text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording...
            </div>
          ) : isProcessing ? (
            <div className="italic text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing audio...
            </div>
          ) : transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-muted-foreground">
              Click the microphone button and speak to convert your voice to text...
            </p>
          )}
        </div>
        
        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
        
        <div className="flex gap-2 justify-between">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={isRecording ? "gap-2" : ""}
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4" />
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
            onClick={handleSubmit}
            disabled={!transcript || isRecording || isProcessing}
          >
            <Send className="h-4 w-4 mr-2" />
            Use Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
