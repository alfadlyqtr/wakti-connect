
import React from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

interface MessageContentProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export function MessageContent({ content, timestamp, isUser }: MessageContentProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 text-sm max-w-md",
        isUser ? "bg-wakti-blue text-white" : "bg-muted"
      )}
    >
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <Markdown>{content}</Markdown>
      </div>
      <div className={cn(
        "text-[10px] mt-1 text-right",
        isUser ? "text-blue-100" : "text-muted-foreground"
      )}>
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
