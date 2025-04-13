
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { MessageBubble } from './MessageBubble';

interface AIAssistantChatProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  canAccess: boolean;
  selectedRole: AIAssistantRole;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  messages, 
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  canAccess,
  selectedRole
}) => {
  // Add a ref to the messages end div for auto-scrolling
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isLoading={index === messages.length - 1 && isLoading && message.role === 'assistant'}
        />
      ))}
      
      {/* Show loading state for assistant message when it's the first message */}
      {isLoading && messages.length === 0 && (
        <MessageBubble
          message={{
            role: 'assistant',
            content: 'Thinking...',
            timestamp: new Date().toISOString(),
          }}
          isLoading={true}
        />
      )}
      
      {/* Empty div for scrolling to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};
