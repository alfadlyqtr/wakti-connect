
import React, { useRef, useEffect } from "react";
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
  Mic,
  MicOff
} from "lucide-react";
import { SimplifiedVoiceRecorder } from "@/components/ai/voice/SimplifiedVoiceRecorder";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const [showVoiceRecorder, setShowVoiceRecorder] = React.useState(false);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);
  
  useEffect(() => {
    if (textareaRef.current && !disabled && !showVoiceRecorder) {
      textareaRef.current.focus();
    }
  }, [disabled, showVoiceRecorder]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
      e.target.value = '';
    }
  };
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(e as unknown as React.FormEvent);
      }
    }
  };
  
  const handleVoiceTranscriptReady = (transcript: string) => {
    setMessage(transcript);
    setShowVoiceRecorder(false);
    
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
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
      {showVoiceRecorder ? (
        <SimplifiedVoiceRecorder 
          onTranscriptReady={handleVoiceTranscriptReady}
          onCancel={() => setShowVoiceRecorder(false)}
          compact
        />
      ) : (
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
                supportsPendingConfirmation && pendingConfirmation && "bg-green-50 border-green-200 placeholder:text-green-600/80"
              )}
              disabled={disabled || isLoading}
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
                  disabled
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
                  setTimeout(() => {
                    onSendMessage(new Event('submit') as unknown as React.FormEvent);
                  }, 100);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {onFileUpload && !pendingConfirmation && !showVoiceRecorder && (
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
            
            {onCameraCapture && !pendingConfirmation && !showVoiceRecorder && (
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
            
            {!pendingConfirmation && (
              <Button
                type="button"
                size="icon"
                variant={showVoiceRecorder ? "destructive" : "outline"}
                className="h-9 w-9 rounded-full"
                onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                disabled={disabled || isLoading}
              >
                {showVoiceRecorder ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {showVoiceRecorder && (
            <span className="text-green-500">Click the mic button to start recording</span>
          )}
        </div>
        {!isMobile && !showVoiceRecorder && (
          <div>
            <span>Press Enter to send</span>
          </div>
        )}
      </div>
    </form>
  );
};
