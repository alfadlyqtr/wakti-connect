
import React from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import i18n from "@/i18n/i18n";

interface MessageContentProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export function MessageContent({ content, timestamp, isUser }: MessageContentProps) {
  // Format the time with the appropriate locale
  const formattedTime = format(
    timestamp,
    "h:mm a",
    { locale: i18n.language === "ar" ? ar : undefined }
  );

  return (
    <div
      className={cn(
        "rounded-lg p-2 sm:p-3 text-xs sm:text-sm max-w-[75%] sm:max-w-md break-words overflow-hidden shadow-sm transition-all",
        isUser 
          ? "bg-wakti-blue text-white animate-slide-in-right" 
          : "bg-muted animate-fade-in border border-muted"
      )}
      style={{ animationDuration: "0.3s" }}
    >
      <div className="prose prose-xs sm:prose-sm max-w-none dark:prose-invert overflow-auto max-h-[400px] thin-scrollbar">
        <Markdown>{content}</Markdown>
      </div>
      <div className={cn(
        "text-[8px] sm:text-[10px] mt-1 text-right",
        isUser ? "text-blue-100" : "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
}
