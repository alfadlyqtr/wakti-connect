
import React from "react";
import { cn } from "@/lib/utils";
import { AIMessage } from "@/types/ai-assistant.types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";

interface AIAssistantMessageProps {
  message: AIMessage;
}

export function AIAssistantMessage({ message }: AIAssistantMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      {!isUser && <MessageAvatar isUser={isUser} />}
      
      <MessageContent 
        content={message.content}
        timestamp={message.timestamp}
        isUser={isUser}
      />
      
      {isUser && <MessageAvatar isUser={isUser} />}
    </div>
  );
}
