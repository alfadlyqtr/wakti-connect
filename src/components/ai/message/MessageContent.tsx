
import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface MessageContentProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export function MessageContent({ content, timestamp, isUser }: MessageContentProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-2 sm:p-3 text-xs sm:text-sm max-w-[75%] sm:max-w-md break-words",
        isUser ? "bg-wakti-blue text-white" : "bg-muted"
      )}
    >
      <div className="prose prose-xs sm:prose-sm max-w-none dark:prose-invert overflow-auto">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className={cn(
        "text-[8px] sm:text-[10px] mt-1 text-right",
        isUser ? "text-blue-100" : "text-muted-foreground"
      )}>
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
