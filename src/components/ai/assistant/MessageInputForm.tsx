
import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SendHorizontal } from 'lucide-react';

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

  useEffect(() => {
    // Focus input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && inputMessage.trim() && canAccess) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 pt-2 mt-auto bg-background">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Input 
            placeholder={
              isLoading ? "WAKTI AI is thinking..." : "Type your message..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !canAccess}
            className="pr-10 py-6 shadow-sm border-wakti-blue/20 focus-visible:ring-wakti-blue/30"
            ref={inputRef}
          />
          {isLoading ? (
            <ThinkingIndicator />
          ) : (
            <Button 
              size="icon" 
              type="submit" 
              disabled={isLoading || !inputMessage.trim() || !canAccess}
              className="absolute right-0 top-0 bottom-0 rounded-l-none h-full bg-wakti-blue hover:bg-wakti-blue/90"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-1.5 text-xs text-center text-muted-foreground">
        {canAccess ? "Press Enter to send" : ""}
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
