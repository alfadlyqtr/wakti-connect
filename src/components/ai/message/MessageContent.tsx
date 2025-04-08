
import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  timestamp?: Date;
  isUser: boolean;
}

export function MessageContent({ content, timestamp, isUser }: MessageContentProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "rounded-xl py-2 px-3",
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted/50 border mr-auto"
        )}
      >
        <div className="prose dark:prose-invert prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Make headings more responsive
              h1: ({ node, ...props }) => <h1 className="text-lg sm:text-xl md:text-2xl font-bold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-base sm:text-lg md:text-xl font-bold" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm sm:text-base md:text-lg font-semibold" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      {timestamp && (
        <div
          className={cn(
            "text-xs text-muted-foreground",
            isUser ? "text-right" : "text-left"
          )}
        >
          {format(new Date(timestamp), "h:mm a")}
        </div>
      )}
    </div>
  );
}
