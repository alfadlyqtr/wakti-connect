
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WAKTIAIMode, WAKTIAIModes } from '@/types/ai-assistant.types';
import { AIMessage } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';

interface AIAssistantChatWindowProps {
  activeMode: WAKTIAIMode;
}

export const AIAssistantChatWindow = ({ activeMode }: AIAssistantChatWindowProps) => {
  const { messages, isLoading, clearMessages } = useAIAssistant();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Show welcome message on first load or mode change
  useEffect(() => {
    setIsFirstLoad(true);
    
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeMode]);

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
    <ScrollArea className={cn("h-[500px] p-4", getModeStyles())}>
      {isFirstLoad && (
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
      
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-start gap-3 mb-4",
              message.role === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            {message.role === 'assistant' ? (
              <Avatar className={cn("h-8 w-8", WAKTIAIModes[activeMode].color)}>
                <Bot className="h-4 w-4 text-white" />
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 bg-muted">
                <User className="h-4 w-4" />
              </Avatar>
            )}
            
            <div className={cn(
              "rounded-lg p-3 max-w-[85%]",
              message.role === 'assistant' 
                ? 'bg-background shadow-sm' 
                : 'bg-primary text-primary-foreground ml-auto'
            )}>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 mb-4"
        >
          <Avatar className={cn("h-8 w-8", WAKTIAIModes[activeMode].color)}>
            <Bot className="h-4 w-4 text-white" />
          </Avatar>
          <div className="bg-background rounded-lg p-3 shadow-sm w-64">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
