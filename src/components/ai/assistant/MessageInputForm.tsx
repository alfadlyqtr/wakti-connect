
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, SendHorizonal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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
  onToggleVoiceToVoice
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={cn(
      "flex flex-col mt-auto p-3 border-t border-border/50 bg-card transition-all",
      isFocused ? "bg-background" : ""
    )}>
      {recognitionSupported && onToggleVoiceToVoice && (
        <div className="flex items-center justify-end mb-2 space-x-2">
          <span className="text-xs text-muted-foreground">Voice conversation</span>
          <Switch 
            checked={voiceToVoiceEnabled}
            onCheckedChange={onToggleVoiceToVoice}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      )}
      
      <form 
        onSubmit={handleSendMessage}
        className="flex items-end gap-2"
      >
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={canAccess ? "Type your message..." : "Upgrade to access AI assistant"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[50px] max-h-[200px] p-3 focus-visible:ring-wakti-blue border-muted-foreground/20"
          rows={1}
          disabled={isLoading || !canAccess || isListening}
        />
        
        <div className="flex items-center gap-1">
          {recognitionSupported && onStartListening && onStopListening && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              className={cn(
                "rounded-full transition-all",
                isListening && "animate-pulse"
              )}
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isLoading || !canAccess}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-wakti-blue hover:bg-wakti-blue/90"
            disabled={isLoading || !inputMessage.trim() || !canAccess || isListening}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
