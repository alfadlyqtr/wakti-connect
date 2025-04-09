
import React from 'react';
import { Mic, Send, AlertCircle, Paperclip, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIAssistantUpgradeCard } from '../AIAssistantUpgradeCard';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  showSuggestions?: boolean;
  onPromptClick?: (prompt: string) => void;
  onFileUpload?: (file: File) => void;
  onCameraCapture?: () => void;
  onStartVoiceInput?: () => void;
  onStopVoiceInput?: () => void;
  isListening?: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  showSuggestions,
  onPromptClick,
  onFileUpload,
  onCameraCapture,
  onStartVoiceInput,
  onStopVoiceInput,
  isListening = false
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const {
    isListening: internalIsListening,
    transcript,
    supportsVoice,
    startListening: internalStartListening,
    stopListening: internalStopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        const updatedText = inputMessage + (inputMessage && !inputMessage.endsWith(' ') && !text.startsWith(' ') ? ' ' : '') + text;
        setInputMessage(updatedText);
      }
    }
  });

  // Use external listening state if provided, otherwise use internal state
  const activeListening = onStartVoiceInput && onStopVoiceInput ? isListening : internalIsListening;
  
  React.useEffect(() => {
    if (transcript) {
      const updatedText = inputMessage + (inputMessage && !inputMessage.endsWith(' ') && !transcript.startsWith(' ') ? ' ' : '') + transcript;
      setInputMessage(updatedText);
    }
  }, [transcript, setInputMessage, inputMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onFileUpload) return;
    
    onFileUpload(files[0]);
    e.target.value = ''; // Reset the input
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!canAccess) {
    return <AIAssistantUpgradeCard compact={true} />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(e);
      }
    }
  };

  const handleVoiceClick = () => {
    if (onStartVoiceInput && onStopVoiceInput) {
      if (isListening) {
        onStopVoiceInput();
      } else {
        onStartVoiceInput();
      }
    } else {
      if (internalIsListening) {
        internalStopListening();
      } else {
        internalStartListening();
      }
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (inputMessage.trim() && !isLoading) {
          handleSendMessage(e);
        }
      }}
      className="border-t p-2 sm:p-3"
    >
      <div className="flex items-end gap-2 relative">
        <div className="relative flex-1">
          <Textarea
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[45px] sm:min-h-[60px] max-h-[120px] sm:max-h-[180px] resize-none py-2 pr-12 text-xs sm:text-sm",
              activeListening && "bg-primary/5 border-primary/20"
            )}
            disabled={isLoading || activeListening}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {supportsVoice && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 sm:h-8 sm:w-8 rounded-full", 
                  activeListening && "bg-primary text-white hover:bg-primary hover:text-white"
                )}
                onClick={handleVoiceClick}
                disabled={isLoading}
              >
                <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">{activeListening ? "Stop recording" : "Start recording"}</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* File Upload */}
        {onFileUpload && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0"
              onClick={handleFileUploadClick}
              disabled={isLoading}
            >
              <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.md"
            />
          </>
        )}
        
        {/* Camera */}
        {onCameraCapture && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0"
            onClick={onCameraCapture}
            disabled={isLoading}
          >
            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Take photo</span>
          </Button>
        )}
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!inputMessage.trim() || isLoading}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0"
        >
          {isLoading ? (
            <div className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-primary border-opacity-50 border-t-primary rounded-full" />
          ) : (
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      
      {/* Mobile note */}
      {isMobile && (
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> 
          Tap send button to submit your message
        </p>
      )}
      
      {/* Desktop note */}
      {!isMobile && (
        <p className="text-xs text-muted-foreground mt-1.5 hidden sm:flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> 
          Press Enter to send, Shift+Enter for new line
        </p>
      )}
    </form>
  );
};
