
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Paperclip, 
  Camera, 
  Loader2, 
  X,
  ChevronRight,
  Mic
} from "lucide-react";
import { VoiceTranscriptionControl } from "@/components/ai/voice/VoiceTranscriptionControl";
import { useVoiceSettings } from "@/store/voiceSettings";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";

interface ChatMessageInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  onFileUpload?: (file: File) => void;
  onCameraCapture?: () => void;
  supportsPendingConfirmation?: boolean;
  pendingConfirmation?: boolean;
  confirmationHint?: string;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  disabled = false,
  onFileUpload,
  onCameraCapture,
  supportsPendingConfirmation = false,
  pendingConfirmation = false,
  confirmationHint
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voiceEnabled } = useVoiceSettings();
  const isMobile = useIsMobile();
  
  // Use speech recognition hook
  const {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    temporaryTranscript,
    confirmTranscript,
    isProcessing,
    supported: voiceSupported,
    error: voiceError
  } = useSpeechRecognition();
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);
  
  // Auto-focus textarea
  useEffect(() => {
    if (textareaRef.current && !disabled && !isRecording && !isProcessing) {
      textareaRef.current.focus();
    }
  }, [disabled, isRecording, isProcessing]);
  
  // Update message with transcript when available
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
      
      // Focus on textarea for editing after transcription
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    }
  }, [transcript, setMessage]);
  
  // Handle temporary transcript (from Whisper API)
  useEffect(() => {
    if (temporaryTranscript && !isRecording && !isProcessing) {
      setMessage(temporaryTranscript);
      confirmTranscript();
      
      // Focus on textarea for editing after transcription
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    }
  }, [temporaryTranscript, isRecording, isProcessing, setMessage, confirmTranscript]);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
      // Reset the input
      e.target.value = '';
    }
  };
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(e as unknown as React.FormEvent);
      }
    }
  };
  
  // Handle voice recording
  const handleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
          onSendMessage(e);
        }
      }} 
      className={cn(
        "border-t bg-background p-2 pt-3 md:p-4 rounded-b-lg flex flex-col gap-2",
        supportsPendingConfirmation && pendingConfirmation && "bg-green-50/50 border-green-100"
      )}
    >
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={pendingConfirmation ? (confirmationHint || "Type 'Go' to confirm") : "Type a message..."}
            className={cn(
              "min-h-[40px] w-full resize-none bg-background py-3 pr-12 text-sm md:pr-14 rounded-lg transition-colors",
              supportsPendingConfirmation && pendingConfirmation && "bg-green-50 border-green-200 placeholder:text-green-600/80",
              isProcessing && "bg-blue-50/50 border-blue-100/50"
            )}
            disabled={disabled || isLoading || isRecording || isProcessing}
            rows={1}
          />
          
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Processing voice...</span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-1 right-1 flex items-center">
            <Button
              size="icon"
              type="submit"
              variant={pendingConfirmation ? "success" : "default"}
              className={cn(
                "h-7 w-7 sm:h-8 sm:w-8 rounded-full",
                pendingConfirmation && "bg-green-600 hover:bg-green-700 text-white"
              )}
              disabled={
                (message.trim().length === 0 && !pendingConfirmation) ||
                isLoading ||
                disabled ||
                isRecording ||
                isProcessing
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : pendingConfirmation ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {pendingConfirmation && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full bg-white border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
                setMessage("cancel");
                // Submit the cancel message automatically
                setTimeout(() => {
                  onSendMessage(new Event('submit') as unknown as React.FormEvent);
                }, 100);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {onFileUpload && !pendingConfirmation && !isRecording && !isProcessing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                disabled={disabled || isLoading}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full"
                onClick={handleFileButtonClick}
                disabled={disabled || isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {onCameraCapture && !pendingConfirmation && !isRecording && !isProcessing && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full"
              onClick={onCameraCapture}
              disabled={disabled || isLoading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
          
          {voiceEnabled && voiceSupported && !pendingConfirmation && (
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              className={cn(
                "h-9 w-9 rounded-full relative",
                isRecording && "bg-red-500 hover:bg-red-600"
              )}
              onClick={handleVoiceRecording}
              disabled={disabled || isLoading || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <span className="h-3 w-3 bg-white rounded-sm" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              
              {isRecording && (
                <span className="absolute -inset-0.5 rounded-full border-2 border-red-400 animate-pulse" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {isRecording && <span className="text-green-500">Recording... Click ✓ when finished</span>}
          {isProcessing && <span className="text-blue-500">Processing your voice...</span>}
          {voiceError && <span className="text-red-500">{voiceError.message}</span>}
        </div>
        {!isMobile && (
          <div>
            <span>Press Enter to send</span>
          </div>
        )}
      </div>
    </form>
  );
};
