
import React from 'react';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/types/ai-assistant.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: AIMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex items-start gap-3 mb-4",
      isUser ? "flex-row-reverse" : ""
    )}>
      <Avatar className={cn(
        "h-8 w-8 border-2",
        isUser ? "bg-primary border-primary/20" : "bg-blue-500 border-blue-500/20"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
        <AvatarFallback>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-lg shadow-sm py-2.5 px-3.5 max-w-[85%] sm:max-w-[75%]",
        isUser 
          ? "bg-primary/10 border border-primary/20 dark:bg-primary/20" 
          : "bg-white/70 dark:bg-slate-800/70 border border-blue-100 dark:border-slate-700 backdrop-blur-sm"
      )}>
        <div className={cn(
          "prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4",
          isUser ? "text-foreground" : "text-foreground"
        )}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
