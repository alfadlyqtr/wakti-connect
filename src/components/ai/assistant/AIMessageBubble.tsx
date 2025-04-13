
import React from "react";
import { AIMessage } from "@/types/ai-assistant.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIMessageBubbleProps {
  message: AIMessage;
  userName?: string;
}

export const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({
  message,
  userName = "You"
}) => {
  const isUser = message.role === "user";
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), "h:mm a")
    : "";
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-in fade-in-50",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {userName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            AI
          </AvatarFallback>
        )}
      </Avatar>
      
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        <div className="prose prose-sm dark:prose-invert break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        
        {formattedTime && (
          <div className={cn(
            "text-[10px] mt-1",
            isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
          )}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};
