
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { InputToolbar } from './InputToolbar';
import { VoiceInputSection } from './VoiceInputSection';
import { Send, Loader2 } from 'lucide-react';

interface AIMessageInputProps {
  activeMode: WAKTIAIMode;
}

export const AIMessageInput = ({ activeMode }: AIMessageInputProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const { sendMessage, isLoading } = useAIAssistant();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageCopy = inputMessage.trim();

    const { success } = await sendMessage(messageCopy);

    if (success) {
      setInputMessage(''); // ✅ Only clear after confirmed success
    } else {
      console.warn('Message failed to send. Input preserved.');
    }
  };
  
  // Get mode-specific button styling
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
      <div className="relative">
        <Textarea
          placeholder={showVoiceInput ? "Listening..." : "Type a message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className={cn(
            "min-h-10 pr-24 resize-none",
            showVoiceInput && "bg-pink-50"
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
        
        <Button 
          type="submit" 
          disabled={!inputMessage.trim() || isLoading} 
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
    </form>
  );
};
