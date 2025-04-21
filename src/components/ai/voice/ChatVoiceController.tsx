
import React from "react";
import { VoiceButton } from "./VoiceButton";
import { useVoiceRecordingToTranscript } from "@/hooks/ai/useVoiceRecordingToTranscript";

interface ChatVoiceControllerProps {
  setInputMessage: (s: string) => void;
  isDisabled?: boolean;
}

export const ChatVoiceController: React.FC<ChatVoiceControllerProps> = ({
  setInputMessage,
  isDisabled = false,
}) => {
  const {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    duration
  } = useVoiceRecordingToTranscript({
    onTranscription: (transcript) => {
      setInputMessage(transcript);
    },
    maxDuration: 30
  });

  // Toggle logic: Mic starts/stops
  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center mr-1">
      <VoiceButton
        isListening={isRecording}
        isLoading={isProcessing}
        isDisabled={!!isDisabled}
        onToggle={handleToggle}
      />
      {isRecording && (
        <div className="text-xs text-pink-600 animate-pulse mt-1">Listening...</div>
      )}
      {isProcessing && (
        <div className="text-xs text-blue-600 mt-1">Processing voice...</div>
      )}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
};
