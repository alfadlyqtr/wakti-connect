
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Loader2, Camera, Upload, Power, Volume2, VolumeX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  recognitionSupported?: boolean;
  voiceToVoiceEnabled?: boolean;
  onToggleVoiceToVoice?: (enabled: boolean) => void;
  onFileUpload?: (file: File) => Promise<void>;
  onCameraCapture?: () => Promise<void>;
  isSpeaking?: boolean;
  onEnterVoiceMode?: () => void;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  isListening = false,
  onStartListening,
  onStopListening,
  recognitionSupported = false,
  voiceToVoiceEnabled = false,
  onToggleVoiceToVoice,
  onFileUpload,
  onCameraCapture,
  isSpeaking = false,
  onEnterVoiceMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle microphone button clicks
  const handleMicrophoneToggle = () => {
    if (isListening && onStopListening) {
      onStopListening();
    } else if (!isListening && onStartListening) {
      onStartListening();
    }
  };

  // Toggle voice-to-voice functionality
  const handleVoiceToVoiceToggle = () => {
    if (onToggleVoiceToVoice) {
      onToggleVoiceToVoice(!voiceToVoiceEnabled);
    }
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !canAccess || !inputMessage.trim()) return;
    await handleSendMessage(e);
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;

    setIsUploading(true);
    try {
      await onFileUpload(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle file upload button click
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle camera capture button click
  const handleCameraCaptureClick = async () => {
    if (!onCameraCapture) return;

    setIsUploading(true);
    try {
      await onCameraCapture();
    } catch (error) {
      console.error("Error capturing from camera:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="border-t p-2 flex flex-col gap-2"
    >
      <div className="flex gap-2">
        {/* Voice-to-Voice toggle */}
        {recognitionSupported && onToggleVoiceToVoice && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0",
              voiceToVoiceEnabled && "bg-green-100 text-green-800"
            )}
            onClick={handleVoiceToVoiceToggle}
            title={
              voiceToVoiceEnabled
                ? "Voice-to-Voice Conversation Active"
                : "Enable Voice-to-Voice Conversation"
            }
          >
            {voiceToVoiceEnabled ? (
              <Power className="h-5 w-5 text-green-600" />
            ) : (
              <Power className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Speech-to-Text toggle */}
        {recognitionSupported && onStartListening && onStopListening && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0",
              isListening && "bg-red-100 text-red-800"
            )}
            onClick={handleMicrophoneToggle}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* File Upload */}
        {onFileUpload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileUploadClick}
              disabled={isLoading || isUploading}
              title="Upload File"
            >
              <Upload className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Camera Capture */}
        {onCameraCapture && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCameraCaptureClick}
            disabled={isLoading || isUploading}
            title="Capture from Camera"
          >
            <Camera className="h-5 w-5" />
          </Button>
        )}

        {/* Voice Mode */}
        {onEnterVoiceMode && recognitionSupported && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEnterVoiceMode}
            className="ml-auto"
            title="Enter Voice Conversation Mode"
          >
            <Volume2 className="h-4 w-4 mr-1" />
            Voice Conversation
          </Button>
        )}
      </div>

      <div className="flex gap-2 items-end">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            !canAccess
              ? "Upgrade to use the AI Assistant"
              : "Type your message here..."
          }
          disabled={!canAccess || isLoading}
          className="min-h-[60px] max-h-[200px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          disabled={
            isLoading ||
            !canAccess ||
            !inputMessage.trim() ||
            isSpeaking ||
            isUploading
          }
          className="flex-shrink-0 self-end"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {voiceToVoiceEnabled && (
        <div className="px-2 py-1 text-xs text-muted-foreground flex items-center">
          <div
            className={cn(
              "w-2 h-2 rounded-full mr-2",
              isSpeaking
                ? "bg-green-500"
                : isListening
                ? "bg-red-500 animate-pulse"
                : "bg-gray-400"
            )}
          ></div>
          {isSpeaking
            ? "AI is speaking..."
            : isListening
            ? "Listening for your voice..."
            : "Voice conversation active"}
        </div>
      )}

      {isUploading && (
        <div className="text-xs text-muted-foreground flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span>Uploading file...</span>
        </div>
      )}
    </form>
  );
};
