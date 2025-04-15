
import React from "react";
import { cn } from "@/lib/utils";
import { AIMessage } from "@/types/ai-assistant.types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AIAssistantMouthAnimation } from "../animation/AIAssistantMouthAnimation";
import { motion } from "framer-motion";

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

  // Animation variants
  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      className={cn(
        "flex w-full items-start gap-1 sm:gap-3 mb-3",
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
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[85%] xs:max-w-[80%] sm:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
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
    </motion.div>
  );
}
