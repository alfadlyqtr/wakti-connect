
import React from "react";
import { cn } from "@/lib/utils";
import { AIMessage } from "@/types/ai-assistant.types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIAssistantMessageProps {
  message: AIMessage;
}

export function AIAssistantMessage({ message }: AIAssistantMessageProps) {
  const isUser = message.role === "user";
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex w-full gap-2 sm:gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && !isMobile && <MessageAvatar isUser={isUser} />}
      
      <div className="flex flex-col gap-1">
        <MessageContent 
          content={message.content}
          timestamp={message.timestamp}
          isUser={isUser}
        />
      </div>
      
      {isUser && !isMobile && <MessageAvatar isUser={isUser} />}
    </div>
  );
}
