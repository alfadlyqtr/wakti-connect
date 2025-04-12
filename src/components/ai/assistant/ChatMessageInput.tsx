
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Paperclip, 
  Camera, 
  Loader2, 
  Check, 
  X,
  ChevronRight
} from "lucide-react";
import { VoiceTranscriptionControl } from "@/components/ai/voice/VoiceTranscriptionControl";
import { useVoiceSettings } from "@/store/voiceSettings";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ChatMessageInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  onFileUpload?: (file: File) => void;
  onCameraCapture?: () => void;
  onStartVoiceInput?: () => void;
  onStopVoiceInput?: () => void;
  isListening?: boolean;
  audioLevel?: number;
  processingVoice?: boolean;
  supportsPendingConfirmation?: boolean;
  pendingConfirmation?: boolean;
  confirmationHint?: string;
  temporaryTranscript?: string;
  onConfirmTranscript?: () => void;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  disabled = false,
  onFileUpload,
  onCameraCapture,
  onStartVoiceInput,
  onStopVoiceInput,
  isListening = false,
  audioLevel = 0,
  processingVoice = false,
  supportsPendingConfirmation = false,
  pendingConfirmation = false,
  confirmationHint,
  temporaryTranscript,
  onConfirmTranscript
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voiceEnabled } = useVoiceSettings();
  const isMobile = useIsMobile();
  const [showVoiceTranscript, setShowVoiceTranscript] = useState(false);
  
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
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);
  
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
    if (!isMobile && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  // Handle confirming voice transcript
  const handleConfirmTranscript = () => {
    if (temporaryTranscript && onConfirmTranscript) {
      onConfirmTranscript();
      setShowVoiceTranscript(false);
    }
  };
  
  // Start voice transcript session
  const handleStartVoiceInput = () => {
    if (onStartVoiceInput) {
      setShowVoiceTranscript(true);
      onStartVoiceInput();
    }
  };
  
  return (
    <form 
      onSubmit={onSendMessage} 
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
              (isListening || processingVoice) && "bg-blue-50/50 border-blue-100/50"
            )}
            disabled={disabled || isLoading || isListening || processingVoice}
            rows={1}
          />
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
                isListening ||
                processingVoice
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
          
          {onFileUpload && !pendingConfirmation && !isListening && !processingVoice && (
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
          
          {onCameraCapture && !pendingConfirmation && !isListening && !processingVoice && (
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
          
          {voiceEnabled && onStartVoiceInput && onStopVoiceInput && !pendingConfirmation && (
            <VoiceTranscriptionControl
              isListening={isListening}
              startListening={handleStartVoiceInput}
              stopListening={onStopVoiceInput}
              processing={processingVoice}
              audioLevel={audioLevel}
              supported={true}
              disabled={disabled || isLoading}
              size="md"
              showConfirmButton={temporaryTranscript !== undefined && !isListening && !processingVoice}
              transcript={temporaryTranscript}
              confirmTranscript={handleConfirmTranscript}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {isListening && <span className="text-blue-500">Voice recording in progress...</span>}
          {processingVoice && <span className="text-amber-500">Transcribing voice...</span>}
          {temporaryTranscript && !isListening && !processingVoice && (
            <span className="text-blue-500">Press ✓ to use this transcription</span>
          )}
        </div>
        {!isMobile && (
          <div>
            <span>Ctrl+Enter to send</span>
          </div>
        )}
      </div>
    </form>
  );
};
