
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Paperclip, Send, Camera, AlertCircle, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { VoiceTranscriptionControl } from '@/components/ai/voice/VoiceTranscriptionControl';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ChatMessageInputProps {
  message: string;
  setMessage: (message: string) => void;
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
  const [isUsingVoice, setIsUsingVoice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onFileUpload) return;
    
    onFileUpload(files[0]);
    e.target.value = ''; // Reset the input
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      
      if (message.trim() && !isLoading && !disabled) {
        onSendMessage(e);
      }
    }
  };
  
  const handleVoiceTranscriptSubmit = (transcript: string) => {
    setMessage(transcript);
    setIsUsingVoice(false);
  };
  
  return (
    <>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim() && !isLoading && !disabled) {
            onSendMessage(e);
          }
        }}
        className="relative border-t p-3 sm:p-4"
      >
        <div className="flex flex-col gap-3">
          {confirmationHint && pendingConfirmation && (
            <div className="px-3 py-1.5 text-xs bg-green-50 border border-green-200 rounded-full text-green-700 flex items-center mx-auto">
              <span>{confirmationHint}</span>
            </div>
          )}
          
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                pendingConfirmation && supportsPendingConfirmation 
                  ? "Type 'Go', 'Yes', or 'Sure' to confirm..." 
                  : "Type your message..."
              }
              className={cn(
                "min-h-[60px] sm:min-h-[80px] max-h-[150px] sm:max-h-[200px] resize-none py-3 px-4 text-sm md:text-base",
                pendingConfirmation && supportsPendingConfirmation && "bg-green-50 border-green-200"
              )}
              disabled={isLoading || disabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                onClick={() => setIsUsingVoice(true)}
                disabled={isLoading || disabled}
              >
                {isUsingVoice ? (
                  <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="sr-only">Use voice input</span>
              </Button>
              
              {onFileUpload && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || disabled}
                  >
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png"
                  />
                </>
              )}
              
              {onCameraCapture && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                  onClick={onCameraCapture}
                  disabled={isLoading || disabled}
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Take photo</span>
                </Button>
              )}
            </div>
            
            <Button 
              type="submit" 
              size="default" 
              disabled={!message.trim() || isLoading || disabled}
              className={cn(
                "h-9 px-4 sm:h-10 sm:px-5 rounded-full",
                pendingConfirmation && supportsPendingConfirmation && "bg-green-600 hover:bg-green-700"
              )}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary border-opacity-50 border-t-primary rounded-full mr-1" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              )}
              <span>{pendingConfirmation && supportsPendingConfirmation ? "Confirm" : "Send"}</span>
            </Button>
          </div>
          
          {/* Mobile note */}
          {isMobile && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> 
              Tap send button to submit your message
            </p>
          )}
          
          {/* Desktop note */}
          {!isMobile && (
            <p className="text-xs text-muted-foreground mt-2 hidden sm:flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> 
              Press Enter to send, Shift+Enter for new line
            </p>
          )}
        </div>
      </form>
      
      {/* Voice Input Dialog */}
      <Dialog open={isUsingVoice} onOpenChange={setIsUsingVoice}>
        <DialogContent className="max-w-md">
          <VoiceTranscriptionControl 
            onTranscriptSubmit={handleVoiceTranscriptSubmit}
            onCancel={() => setIsUsingVoice(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
