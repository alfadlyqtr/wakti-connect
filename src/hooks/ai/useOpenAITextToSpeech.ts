
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TextToSpeechOptions {
  voice?: string;
  model?: string;
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (error: any) => void;
}

export const useOpenAITextToSpeech = (options?: TextToSpeechOptions) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to speak text
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop any existing audio
      if (audio) {
        audio.pause();
        audio.remove();
      }
      
      // Call Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { 
          text, 
          voice: options?.voice || 'alloy',
          model: options?.model || 'tts-1',
          responseFormat: 'mp3'
        }
      });
      
      if (functionError) {
        console.error('OpenAI Text-to-Speech API error:', functionError);
        setError(functionError.message || 'Failed to generate speech');
        options?.onError?.(functionError);
        toast({
          title: 'Speech Error',
          description: 'Could not generate speech audio. Falling back to browser speech.',
          variant: 'destructive',
        });
        
        // Fallback to browser speech synthesis
        fallbackToSpeechSynthesis(text);
        return;
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }
      
      // Convert base64 to blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      
      // Create audio element
      const audioUrl = URL.createObjectURL(blob);
      const newAudio = new Audio(audioUrl);
      
      // Set up event handlers
      newAudio.onplay = () => {
        setIsSpeaking(true);
        options?.onStart?.();
      };
      
      newAudio.onended = () => {
        setIsSpeaking(false);
        options?.onFinish?.();
        URL.revokeObjectURL(audioUrl); // Clean up
      };
      
      newAudio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        setError('Audio playback failed');
        options?.onError?.(e);
        URL.revokeObjectURL(audioUrl); // Clean up
        
        // Fallback to browser speech synthesis
        fallbackToSpeechSynthesis(text);
      };
      
      // Store the audio element
      setAudio(newAudio);
      
      // Play the audio
      await newAudio.play();
      
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      options?.onError?.(err);
      
      toast({
        title: 'Speech Error',
        description: 'Could not generate speech audio. Falling back to browser speech.',
        variant: 'destructive',
      });
      
      // Fallback to browser speech synthesis
      fallbackToSpeechSynthesis(text);
    } finally {
      setIsLoading(false);
    }
  }, [audio, options, toast]);
  
  // Fallback to browser's speech synthesis
  const fallbackToSpeechSynthesis = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Browser does not support speech synthesis');
      return;
    }
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set up event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        options?.onStart?.();
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        options?.onFinish?.();
      };
      
      utterance.onerror = (e) => {
        console.error('Browser speech synthesis error:', e);
        setIsSpeaking(false);
        options?.onError?.(e);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Browser speech synthesis fallback error:', err);
    }
  }, [options]);
  
  // Function to stop speaking
  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsSpeaking(false);
    }
    
    // Also stop browser speech synthesis if it's being used
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    options?.onFinish?.();
  }, [audio, options]);
  
  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error
  };
};
