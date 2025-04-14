
import { useState, useEffect, useCallback } from 'react';

interface ElevenLabsVoiceOptions {
  onTranscriptComplete?: (transcript: string) => void;
  continuousListening?: boolean;
  apiKey?: string;
}

export const useElevenLabsVoice = (options: ElevenLabsVoiceOptions = {}) => {
  const { 
    onTranscriptComplete, 
    continuousListening = false,
    apiKey = 'sk_226b608fe1ec5b8fddc458a0370c7e8006910ee812ccec5d' // Default API key
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // MediaRecorder reference
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  // Check browser support
  const supportsVoice = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices;
  
  // Start recording audio
  const startListening = useCallback(async () => {
    if (!supportsVoice) {
      setError(new Error('Voice recording not supported in this browser'));
      return;
    }
    
    try {
      setAudioChunks([]);
      setIsListening(true);
      setTranscript('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      });
      
      recorder.addEventListener('stop', () => {
        setIsListening(false);
        setIsProcessing(true);
        
        // Process the audio
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        processAudioWithElevenLabs(audioBlob);
      });
      
      recorder.start();
      setMediaRecorder(recorder);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error starting voice recording'));
      setIsListening(false);
    }
  }, [supportsVoice, audioChunks]);
  
  // Stop recording
  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop all tracks in the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }, [mediaRecorder]);
  
  // Process audio with ElevenLabs API
  const processAudioWithElevenLabs = async (audioBlob: Blob) => {
    try {
      // In a real implementation, you'd send this to your backend or an Edge Function
      // For demonstration, simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a transcript result
      const simulatedTranscript = 'This is a simulated transcript from ElevenLabs voice recognition.';
      setTranscript(simulatedTranscript);
      
      if (onTranscriptComplete) {
        onTranscriptComplete(simulatedTranscript);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error processing audio'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clean up
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);
  
  return {
    isListening,
    isProcessing,
    transcript,
    error,
    supportsVoice,
    startListening,
    stopListening,
  };
};
