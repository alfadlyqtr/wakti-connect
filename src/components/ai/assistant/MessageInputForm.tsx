
import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, MicOff, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Voice interaction hook
  const {
    isListening,
    supportsVoice,
    lastTranscript,
    isProcessing,
    startListening,
    stopListening,
    clearTranscript
  } = useVoiceInteraction();

  // Use the transcript when it changes
  useEffect(() => {
    if (lastTranscript) {
      setInputMessage(lastTranscript);
      clearTranscript();
      
      // Auto-submit if we have a clear transcript
      if (lastTranscript.length > 5 && canAccess && !isLoading) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true }) as unknown as React.FormEvent;
        handleSendMessage(submitEvent);
      }
    }
  }, [lastTranscript, setInputMessage, clearTranscript, handleSendMessage, canAccess, isLoading]);

  useEffect(() => {
    // Focus input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle voice input toggle
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 pt-2 mt-auto">
      <div className="relative flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant={isListening ? "default" : "ghost"}
          onClick={toggleVoiceInput}
          className={`size-10 flex-shrink-0 ${isListening ? 'bg-wakti-blue text-white' : ''}`}
          disabled={isLoading || !canAccess || isProcessing}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        <div className="relative flex-1">
          <Input 
            placeholder={
              isListening ? "Listening..." : 
              isProcessing ? "Processing..." :
              isLoading ? "WAKTI AI is thinking..." : 
              "Type your message..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading || !canAccess || isListening || isProcessing}
            className={cn(
              "pr-10",
              isListening ? "bg-blue-50" : "",
              isProcessing ? "bg-yellow-50" : ""
            )}
            ref={inputRef}
          />
          {isLoading ? (
            <ThinkingIndicator />
          ) : (
            <Button 
              size="icon" 
              type="submit" 
              disabled={isLoading || !inputMessage.trim() || !canAccess || isListening || isProcessing}
              className="absolute right-0 top-0 bottom-0 rounded-l-none"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

// Loading dots indicator when AI is thinking
const ThinkingIndicator: React.FC = () => (
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="h-2 w-2 bg-wakti-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  </div>
);
