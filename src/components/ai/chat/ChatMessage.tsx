
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
      "flex items-start gap-4 py-4 px-2",
      isUser ? "flex-row-reverse" : ""
    )}>
      <Avatar className={cn(
        "h-10 w-10 border-2 shadow-md",
        isUser ? "bg-primary/90 border-primary/20" : "bg-blue-500/90 border-blue-500/20"
      )}>
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
        <AvatarFallback>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-2xl py-3 px-5 max-w-[80%] transition-all message-bubble",
        isUser 
          ? "bg-primary/10 dark:bg-primary/20 border border-primary/10 backdrop-blur-md shadow-lg hover:shadow-primary/10" 
          : "bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/20 backdrop-blur-md shadow-lg hover:shadow-blue-500/10"
      )}>
        <div className={cn(
          "prose prose-sm dark:prose-invert prose-p:my-1.5 prose-headings:mb-2 prose-headings:mt-4",
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
