
import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

interface ChatMessageProps {
  message: ChatMemoryMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { currentPersonality } = useAIPersonality();
  const isUser = message.role === 'user';
  
  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        isUser ? "bg-muted" : currentPersonality.color
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </Avatar>
      
      <div className={cn(
        "p-3 rounded-2xl max-w-[85%] shadow-sm backdrop-blur-sm",
        isUser 
          ? "bg-muted text-foreground" 
          : "bg-white/90 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/50 text-foreground"
      )}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
