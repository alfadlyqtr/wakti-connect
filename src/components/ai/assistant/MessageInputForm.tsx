
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Loader2, Camera, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
  onFileUpload?: (file: File) => Promise<void>;
  onCameraCapture?: () => Promise<void>;
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
  onFileUpload,
  onCameraCapture,
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
        {/* Speech-to-Text toggle with tooltip */}
        {recognitionSupported && onStartListening && onStopListening && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "ghost"}
                  size="icon"
                  className={cn(
                    "flex-shrink-0",
                    isListening && "bg-red-100 animate-pulse"
                  )}
                  onClick={handleMicrophoneToggle}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? "Stop voice input" : "Start voice input"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleFileUploadClick}
                    disabled={isLoading || isUploading}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {/* Camera Capture */}
        {onCameraCapture && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCameraCaptureClick}
                  disabled={isLoading || isUploading}
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Capture image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex gap-2 items-end">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            !canAccess
              ? "Upgrade to use the AI Assistant"
              : isListening 
                ? "Listening for your voice..." 
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

      {isListening && (
        <div className="px-2 py-1 text-xs text-muted-foreground flex items-center">
          <div className="w-2 h-2 rounded-full mr-2 bg-red-500 animate-pulse"></div>
          Listening for your voice...
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
