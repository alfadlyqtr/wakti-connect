
import { useState, useRef, useCallback } from "react";

export function useWaktiAIBrowserSpeech(onResult?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const supportsVoice =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!supportsVoice) return;

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    // Enable continuous listening to capture full sentences
    recognition.continuous = true;
    // Enable interim results to show text as user speaks
    recognition.interimResults = true;
    recognition.lang = "en-US";

    setTranscript("");
    setIsListening(true);

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript = event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
      
      // Only call onResult for final results, not interim ones
      if (event.results[event.results.length - 1].isFinal && onResult) {
        onResult(currentTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [supportsVoice, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening,
  };
}
