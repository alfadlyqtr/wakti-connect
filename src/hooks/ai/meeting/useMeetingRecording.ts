
import { useState, useEffect } from 'react';
import { useVoiceInteraction } from '../useVoiceInteraction';
import { toast } from '@/components/ui/use-toast';

const LANGUAGE_STORAGE_KEY = 'meeting-summary-language-preference';

export interface MeetingRecordingState {
  isRecording: boolean;
  recordingTime: number;
  recordingError: string | null;
  transcribedText: string;
  audioData: Blob | null;
}

export const useMeetingRecording = () => {
  const [state, setState] = useState<MeetingRecordingState>({
    isRecording: false,
    recordingTime: 0,
    recordingError: null,
    transcribedText: '',
    audioData: null,
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  });

  const {
    startListening,
    stopListening,
    transcript,
    lastTranscript,
    error,
    supportsVoice,
    recordingDuration,
  } = useVoiceInteraction();

  useEffect(() => {
    if (error) {
      setState(prevState => ({ ...prevState, recordingError: error.message }));
    }
  }, [error]);

  useEffect(() => {
    if (lastTranscript) {
      setState(prevState => ({ ...prevState, transcribedText: lastTranscript }));
    }
  }, [lastTranscript]);

  useEffect(() => {
    if (transcript) {
      setState(prevState => ({
        ...prevState,
        transcribedText: transcript,
      }));
    }
  }, [transcript]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.isRecording) {
      intervalId = setInterval(() => {
        setState(prevState => ({ ...prevState, recordingTime: prevState.recordingTime + 1 }));
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [state.isRecording]);

  const startRecording = () => {
    setState(prevState => ({ 
      ...prevState, 
      isRecording: true, 
      recordingTime: 0, 
      recordingError: null,
      transcribedText: '', // Reset transcribed text when starting new recording
    }));
    startListening();
    
    toast({
      title: "Recording started",
      description: "Speak clearly for better transcription results.",
    });
  };

  const stopRecording = () => {
    setState(prevState => ({ ...prevState, isRecording: false }));
    stopListening();
    
    toast({
      title: "Recording stopped",
      description: "Recording has been stopped and processed.",
    });
  };

  const clearRecording = () => {
    setState({
      isRecording: false,
      recordingTime: 0,
      recordingError: null,
      transcribedText: '',
      audioData: null,
    });
  };

  return {
    recordingState: state,
    selectedLanguage,
    setSelectedLanguage,
    supportsVoice,
    startRecording,
    stopRecording,
    clearRecording,
  };
};
