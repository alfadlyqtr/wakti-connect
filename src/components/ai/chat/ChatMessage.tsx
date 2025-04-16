import React, { useState } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot, Download, ExternalLink, Maximize2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';

interface ChatMessageProps {
  message: ChatMemoryMessage;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const [enlarged, setEnlarged] = useState(false);
  const { currentPersonality } = useAIPersonality();
  const isUser = message.role === 'user';
  
  const getPersonalityColor = () => {
    return currentPersonality.color || 'bg-blue-600';
  };
  
  const handleDownloadImage = () => {
    if (!message.imageUrl) return;
    
    // Create an anchor element
    const link = document.createElement('a');
    link.href = message.imageUrl;
    link.download = `ai-generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleOpenImage = () => {
    if (!message.imageUrl) return;
    window.open(message.imageUrl, '_blank');
  };
  
  const handleToggleEnlarge = () => {
    setEnlarged(prev => !prev);
  };
  
  return (
    <motion.div
      className={cn(
        "flex w-full my-4",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "flex gap-3 items-start max-w-[90%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className="flex-shrink-0">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
            isUser ? "bg-gradient-to-tr from-slate-700 to-slate-800" : getPersonalityColor()
          )}>
            {isUser ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <Bot className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
        
        <div className={cn(
          "bg-black/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/10 rounded-2xl p-4 space-y-2 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)]",
          isUser ? "rounded-tr-sm" : "rounded-tl-sm",
          isLoading ? "animate-pulse" : ""
        )}>
          <div className="prose prose-invert overflow-hidden break-words max-w-full">
            <Markdown
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...rest}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
          
          {message.imageUrl && (
            <div className="mt-4 space-y-2">
              <div className={cn(
                "relative overflow-hidden rounded-md border border-white/10 shadow-md transition-all duration-300",
                enlarged ? "max-w-full w-full" : "max-w-[300px]"
              )}>
                <img 
                  src={message.imageUrl} 
                  alt="AI Generated" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-black/50 border-white/10 hover:bg-black/70"
                    onClick={handleToggleEnlarge}
                  >
                    {enlarged ? (
                      <ZoomIn className="h-4 w-4 text-white" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-white" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-black/50 border-white/10 hover:bg-black/70"
                    onClick={handleDownloadImage}
                  >
                    <Download className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-black/50 border-white/10 hover:bg-black/70"
                    onClick={handleOpenImage}
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                Generated image based on your request
              </p>
            </div>
          )}
          
          {message.timestamp && (
            <div className="text-xs text-slate-500 mt-1">
              {formatRelativeTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
