
import React from 'react';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

interface ChatMessageProps {
  message: ChatMemoryMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const { currentPersonality } = useAIPersonality();
  const isUser = message.role === 'user';
  
  // Get user avatar or initial
  const userAvatarUrl = user?.user_metadata?.avatar_url || null;
  const userInitial = user?.user_metadata?.full_name?.[0] || 
                      user?.user_metadata?.name?.[0] || 
                      user?.email?.[0]?.toUpperCase() || 'U';
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={cn(
        "flex items-start gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className={cn("h-8 w-8", currentPersonality.color)}>
          <AvatarFallback>
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "max-w-[85%] rounded-lg p-3 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground"
            : "bg-card border"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        
        {message.timestamp && (
          <div className="text-[10px] mt-1 opacity-60 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-muted">
          {userAvatarUrl ? (
            <AvatarImage src={userAvatarUrl} alt="User" />
          ) : (
            <AvatarFallback>{userInitial}</AvatarFallback>
          )}
        </Avatar>
      )}
    </motion.div>
  );
};
