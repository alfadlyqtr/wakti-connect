
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Mic, MicOff } from "lucide-react";

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
  recognitionSupported = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleVoiceToggle = () => {
    if (isListening) {
      onStopListening?.();
    } else {
      onStartListening?.();
    }
  };
  
  return (
    <form 
      onSubmit={handleSendMessage} 
      className="p-2 sm:p-3 border-t flex items-center gap-2 bg-white"
    >
      <div className={`flex-1 rounded-lg border bg-background px-3 py-2 text-sm ${isFocused ? 'ring-2 ring-ring ring-offset-0' : ''}`}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={canAccess ? "Type your message..." : "Upgrade to use AI Assistant"}
          className="w-full bg-transparent outline-none"
          disabled={!canAccess || isLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      {recognitionSupported && canAccess && (
        <Button
          type="button"
          size="icon"
          variant={isListening ? "destructive" : "outline"}
          onClick={handleVoiceToggle}
          disabled={isLoading || !canAccess}
          className="relative"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </>
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <Button 
        type="submit" 
        size="icon"
        disabled={!inputMessage.trim() || isLoading || !canAccess}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
