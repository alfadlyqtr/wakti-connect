
import React from 'react';
import { Mic, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIAssistantUpgradeCard } from '../AIAssistantUpgradeCard';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

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
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        const updatedText = inputMessage + (inputMessage && !inputMessage.endsWith(' ') && !text.startsWith(' ') ? ' ' : '') + text;
        setInputMessage(updatedText);
      }
    }
  });

  React.useEffect(() => {
    if (transcript) {
      const updatedText = inputMessage + (inputMessage && !inputMessage.endsWith(' ') && !transcript.startsWith(' ') ? ' ' : '') + transcript;
      setInputMessage(updatedText);
    }
  }, [transcript, setInputMessage, inputMessage]);

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
            placeholder={t("ai.messagePlaceholder", "Type a message...")}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[60px] max-h-[180px] resize-none py-2 pr-12 text-sm sm:text-base",
              isListening && "bg-primary/5 border-primary/20"
            )}
            disabled={isLoading || isListening}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {supportsVoice && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full", 
                  isListening && "bg-primary text-white hover:bg-primary hover:text-white"
                )}
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">{isListening ? "Stop recording" : "Start recording"}</span>
              </Button>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!inputMessage.trim() || isLoading}
          className="h-10 w-10 rounded-full shrink-0"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-50 border-t-primary rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      
      {/* Mobile note */}
      {isMobile && (
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> 
          {t("ai.tapToSend", "Tap send button to submit your message")}
        </p>
      )}
      
      {/* Desktop note */}
      {!isMobile && (
        <p className="text-xs text-muted-foreground mt-1.5 hidden sm:flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> 
          {t("ai.pressEnter", "Press Enter to send, Shift+Enter for new line")}
        </p>
      )}
    </form>
  );
};
