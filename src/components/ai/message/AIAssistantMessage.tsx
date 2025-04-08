
import React from "react";
import { cn } from "@/lib/utils";
import { AIMessage } from "@/types/ai-assistant.types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AIAssistantMouthAnimation } from "../animation/AIAssistantMouthAnimation";

interface AIAssistantMessageProps {
  message: AIMessage;
  isActive?: boolean;
  isSpeaking?: boolean;
}

export function AIAssistantMessage({ 
  message, 
  isActive = false, 
  isSpeaking = false
}: AIAssistantMessageProps) {
  const isUser = message.role === "user";
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex w-full items-start gap-1 sm:gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="shrink-0 hidden xs:block">
          {isActive ? (
            <AIAssistantMouthAnimation isActive={true} isSpeaking={isSpeaking} />
          ) : (
            <MessageAvatar isUser={isUser} />
          )}
        </div>
      )}
      
      <div className="flex flex-col gap-1 max-w-[85%] xs:max-w-[80%] sm:max-w-[75%]">
        <MessageContent 
          content={message.content}
          timestamp={message.timestamp}
          isUser={isUser}
        />
      </div>
      
      {isUser && (
        <div className="shrink-0 hidden xs:block">
          <MessageAvatar isUser={isUser} />
        </div>
      )}
    </div>
  );
}
