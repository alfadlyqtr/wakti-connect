
import React from 'react';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/types/ai-assistant.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

interface ChatMessageProps {
  message: AIMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const { currentMode } = useAIPersonality();
  
  const getModeSpecificStyles = () => {
    if (isUser) {
      // User message styles based on mode
      switch (currentMode) {
        case 'general':
          return "bg-blue-500/30 border-blue-400/40 text-white";
        case 'student':
          return "bg-green-500/30 border-green-400/40 text-white";
        case 'productivity':
          return "bg-purple-500/30 border-purple-400/40 text-white";
        case 'creative':
          return "bg-pink-500/30 border-pink-400/40 text-white";
        default:
          return "bg-blue-500/30 border-blue-400/40 text-white";
      }
    } else {
      // AI message styles based on mode
      switch (currentMode) {
        case 'general':
          return "bg-blue-950/40 border-blue-800/30 text-white";
        case 'student':
          return "bg-green-950/40 border-green-800/30 text-white";
        case 'productivity':
          return "bg-purple-950/40 border-purple-800/30 text-white";
        case 'creative':
          return "bg-pink-950/40 border-pink-800/30 text-white";
        default:
          return "bg-blue-950/40 border-blue-800/30 text-white";
      }
    }
  };
  
  const getAvatarStyles = () => {
    if (isUser) {
      return "bg-primary/90 border-primary/30";
    } else {
      switch (currentMode) {
        case 'general':
          return "bg-blue-500/90 border-blue-500/30";
        case 'student':
          return "bg-green-500/90 border-green-500/30";
        case 'productivity':
          return "bg-purple-500/90 border-purple-500/30";
        case 'creative':
          return "bg-pink-500/90 border-pink-500/30";
        default:
          return "bg-blue-500/90 border-blue-500/30";
      }
    }
  };
  
  return (
    <div className={cn(
      "flex items-start gap-4 py-4 px-2",
      isUser ? "flex-row-reverse" : ""
    )}>
      <Avatar className={cn(
        "h-12 w-12 border-2 shadow-xl transform hover:scale-110 transition-transform duration-300",
        getAvatarStyles()
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
        "rounded-2xl py-3 px-5 max-w-[80%] transition-all message-bubble transform hover:translate-y-[-5px] duration-300",
        "border backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]",
        getModeSpecificStyles()
      )}>
        <div className={cn(
          "prose prose-sm prose-p:my-1.5 prose-headings:mb-2 prose-headings:mt-4",
          "text-foreground prose-headings:text-white/90 prose-strong:text-white/90"
        )}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
