
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { InputToolbar } from './InputToolbar';
import { VoiceInputSection } from './VoiceInputSection';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIMessageInputProps {
  activeMode: WAKTIAIMode;
}

export const AIMessageInput = ({ activeMode }: AIMessageInputProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const { 
    sendMessage, 
    isLoading, 
    isMessageProcessing, 
    getCurrentProcessingMessage,
    retryLastMessage,
    hasFailedMessage
  } = useAIAssistant();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageRef = useRef('');
  const [sendError, setSendError] = useState<string | null>(null);

  // Check for failed message that can be retried or restored
  useEffect(() => {
    const currentProcessingMessage = getCurrentProcessingMessage();
    if (currentProcessingMessage && inputMessage === '') {
      // Restore the failed message to the input field
      setInputMessage(currentProcessingMessage);
      toast({
        title: "Message not sent",
        description: "Your previous message wasn't sent. You can edit it and try again.",
        variant: "destructive",
      });
    }
  }, [getCurrentProcessingMessage, inputMessage]);

  useEffect(() => {
    if (inputMessage && !isLoading) {
      prevMessageRef.current = inputMessage;
    }
  }, [inputMessage, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading || isMessageProcessing()) return;

    const messageCopy = inputMessage.trim();
    setSendError(null);
    
    try {
      const { success, error } = await sendMessage(messageCopy);

      if (success) {
        setInputMessage('');
        prevMessageRef.current = '';
        setSendError(null);
      } else {
        // Don't clear the input on failure to allow for retry
        console.warn('Message failed to send. Input preserved.', error);
        setSendError(error?.message || 'Failed to send message. Try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error.message || 'An unexpected error occurred');
      // Input is preserved so the user can try again
    }
  };

  const handleRetry = async () => {
    setSendError(null);
    try {
      const { success } = await retryLastMessage();
      if (success) {
        setInputMessage('');
        prevMessageRef.current = '';
      }
    } catch (error) {
      console.error('Error retrying message:', error);
      setSendError('Failed to retry message');
    }
  };

  const getModeButtonStyle = () => {
    switch (activeMode) {
      case 'general':
        return 'bg-wakti-blue hover:bg-wakti-blue/90';
      case 'productivity':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'student':
        return 'bg-green-600 hover:bg-green-700';
      case 'creative':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="space-y-2">
      {sendError && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md flex items-center justify-between">
          <span>{sendError}</span>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 h-auto"
            onClick={() => setSendError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
      
      <div className="relative">
        <Textarea
          ref={inputRef}
          placeholder={showVoiceInput ? "Listening..." : "Type a message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className={cn(
            "min-h-10 pr-24 resize-none",
            showVoiceInput && "bg-pink-50",
            sendError && "border-red-300 focus-visible:ring-red-500"
          )}
          disabled={isLoading || showVoiceInput}
        />
        
        <InputToolbar 
          isLoading={isLoading} 
          isListening={showVoiceInput}
          onVoiceToggle={() => setShowVoiceInput(!showVoiceInput)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <VoiceInputSection 
          showVoiceInput={showVoiceInput} 
          isListening={showVoiceInput}
          transcript=""
          setInputMessage={setInputMessage}
        />
        
        <div className="flex items-center gap-2">
          {hasFailedMessage() && (
            <Button 
              type="button" 
              onClick={handleRetry}
              variant="outline"
              className="px-3"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading || isMessageProcessing()} 
            className={cn("px-4", getModeButtonStyle())}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Send
          </Button>
        </div>
      </div>
    </form>
  );
};
