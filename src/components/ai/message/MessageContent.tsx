
import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { useAIPersonality } from "@/components/ai/personality-switcher/AIPersonalityContext";

interface MessageContentProps {
  content: string;
  timestamp?: Date | string;
  isUser?: boolean;
  className?: string;
}

export function MessageContent({ 
  content, 
  timestamp,
  isUser = false,
  className
}: MessageContentProps) {
  const { currentMode } = useAIPersonality();
  
  // Format timestamp if it exists
  const formattedTime = timestamp ? 
    (typeof timestamp === 'string' ? 
      format(new Date(timestamp), 'h:mm a') : 
      format(timestamp, 'h:mm a')
    ) : '';
    
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

  return (
    <div className={cn(
      "p-3 rounded-lg relative group border backdrop-blur-xl",
      getModeSpecificStyles(),
      className
    )}>
      <div className={cn(
        "prose prose-sm max-w-none break-words",
        "prose-headings:text-white/90 prose-strong:text-white/90"
      )}>
        {isUser ? (
          <div className="text-white">{content}</div>
        ) : (
          <div className="prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-li:my-0.5 text-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {timestamp && (
        <div className={cn(
          "text-[10px] mt-1 opacity-60 text-right",
          "text-white/80"
        )}>
          {formattedTime}
        </div>
      )}
    </div>
  );
}
