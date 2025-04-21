
// Short: Only thing that changes is how the audio is sent for transcription; now we upload the webm Blob direct (not base64).
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseVoiceRecordingToTranscriptOptions {
  onTranscription: (transcript: string) => void;
  maxDuration?: number;
}

export function useVoiceRecordingToTranscript({
  onTranscription,
  maxDuration = 60
}: UseVoiceRecordingToTranscriptOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);

  const startRecording = async () => {
    setError(null);
    setDuration(0);
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = handleStopRecording;

      mediaRecorder.start();
      setIsRecording(true);
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setDuration(seconds);
        if (seconds >= maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      setError("Microphone access denied or unavailable.");
      toast.error("Microphone access denied. Please allow permission!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  // Handler called by mediaRecorder.onstop
  const handleStopRecording = async () => {
    setIsProcessing(true);
    setError(null);
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    if (!audioBlob || audioBlob.size < 100) {
      setError("No audio data recorded.");
      setIsProcessing(false);
      return;
    }

    try {
      // Create multipart/form-data
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      // Post as file directly to the edge function
      const res = await fetch(`${supabase.functions._functionsUrl}/voice-transcription`, {
        method: "POST",
        headers: {
          "apikey": supabase._headers["apikey"] || "",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.text) {
        throw new Error(data?.error || "Transcription failed.");
      }
      onTranscription(data.text as string);
      toast.success("Voice transcribed!");
    } catch (err: any) {
      setError("Failed to transcribe audio.");
      toast.error("Transcription failed. Try again!");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    error,
    duration,
    startRecording,
    stopRecording
  };
}

