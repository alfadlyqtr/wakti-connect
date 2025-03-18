
import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { AIMessage } from "@/hooks/useAIAssistant";
import Markdown from "react-markdown";

interface AIAssistantMessageProps {
  message: AIMessage;
}

export function AIAssistantMessage({ message }: AIAssistantMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[80%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-wakti-blue flex items-center justify-center text-white flex-shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-lg p-3 text-sm",
          isUser
            ? "bg-wakti-blue text-white"
            : "bg-muted"
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown>{message.content}</Markdown>
        </div>
        <div className={cn(
          "text-[10px] mt-1",
          isUser ? "text-blue-100" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
