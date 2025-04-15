
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WAKTIAIMode, WAKTIAIModes } from '@/types/ai-assistant.types';
import { AIMessage } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Trash2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Skeleton } from '@/components/ui/skeleton';
import { useGlobalChatMemory } from '@/hooks/ai/chat/useGlobalChatMemory';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TypingIndicator } from '../animation';

interface AIAssistantChatWindowProps {
  activeMode: WAKTIAIMode;
  onClearChat?: () => void;
}

export const AIAssistantChatWindow = ({ activeMode, onClearChat }: AIAssistantChatWindowProps) => {
  // Use the AI assistant hook to get messages and loading state
  const { messages, isLoading } = useAIAssistant();
  
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef(messages.length);
  const previousModeRef = useRef(activeMode);
  
  // Determine if we should show the welcome message based on the current mode's messages
  useEffect(() => {
    setShowWelcomeMessage(messages.length === 0);
  }, [messages, activeMode]);
  
  // Scroll to bottom of messages when new messages arrive or loading state changes
  useEffect(() => {
    if (messagesEndRef.current && (messages.length > previousMessagesLength.current || isLoading)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      previousMessagesLength.current = messages.length;
    }
  }, [messages, isLoading]);

  // Reset previous messages length when mode changes
  useEffect(() => {
    if (previousModeRef.current !== activeMode) {
      previousMessagesLength.current = messages.length;
      previousModeRef.current = activeMode;
      
      // Force scroll to bottom on mode change
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [activeMode, messages.length]);

  // Get mode-specific styling
  const getModeStyles = () => {
    switch (activeMode) {
      case 'general':
        return 'bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-blue-500/10';
      case 'productivity':
        return 'bg-gradient-to-r from-purple-50 to-purple-100/50 shadow-purple-500/10';
      case 'student':
        return 'bg-gradient-to-r from-green-50 to-green-100/50 shadow-green-500/10';
      case 'creative':
        return 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 shadow-purple-500/10';
      default:
        return 'bg-white';
    }
  };

  return (
    <ScrollArea className={cn("h-[500px] p-4 relative", getModeStyles())}>
      {messages.length > 0 && onClearChat && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-70 hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-colors z-10"
          onClick={onClearChat}
          title="Clear chat history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    
      {showWelcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-3 mb-6"
        >
          <Avatar className={cn("h-8 w-8", WAKTIAIModes[activeMode].color)}>
            <Bot className="h-4 w-4 text-white" />
          </Avatar>
          <div className="bg-background rounded-lg p-3 shadow-sm">
            <p className="text-sm">{WAKTIAIModes[activeMode].defaultPrompt}</p>
          </div>
        </motion.div>
      )}
      
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className="flex items-start gap-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar className={cn("h-8 w-8", 
            msg.role === 'assistant' 
              ? WAKTIAIModes[activeMode].color 
              : "bg-muted"
          )}>
            {msg.role === 'assistant' ? (
              <Bot className="h-4 w-4 text-white" />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </Avatar>
          <div className="bg-background rounded-lg p-3 shadow-sm max-w-[85%]">
            <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-1 prose-headings:mb-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
            {msg.timestamp && (
              <div className="text-[10px] mt-1 opacity-60 text-right text-muted-foreground">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 mb-4"
        >
          <Avatar className={cn("h-8 w-8", WAKTIAIModes[activeMode].color)}>
            <Bot className="h-4 w-4 text-white" />
          </Avatar>
          <div className="bg-background rounded-lg py-2.5 px-3.5 border">
            <TypingIndicator className="text-muted-foreground" />
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
