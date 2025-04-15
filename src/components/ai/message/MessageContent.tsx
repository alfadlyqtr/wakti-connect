
import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  timestamp?: Date | string;
  isUser?: boolean;
  className?: string; // Add className prop to the interface
}

export function MessageContent({ 
  content, 
  timestamp,
  isUser = false,
  className
}: MessageContentProps) {
  // Format timestamp if it exists
  const formattedTime = timestamp ? 
    (typeof timestamp === 'string' ? 
      format(new Date(timestamp), 'h:mm a') : 
      format(timestamp, 'h:mm a')
    ) : '';

  return (
    <div className={cn(
      "p-3 rounded-lg relative group",
      isUser 
        ? "bg-primary text-primary-foreground" 
        : "bg-card border shadow-sm",
      className // Add className to the className list
    )}>
      <div className={cn(
        "prose prose-sm max-w-none break-words",
        isUser ? "prose-invert" : "prose-neutral dark:prose-invert"
      )}>
        {isUser ? (
          <div>{content}</div>
        ) : (
          <div className="prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-li:my-0.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {timestamp && (
        <div className={cn(
          "text-[10px] mt-1 opacity-60 text-right",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {formattedTime}
        </div>
      )}
    </div>
  );
}
