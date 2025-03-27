
import React from "react";
import { cn } from "@/lib/utils";
import { AIMessage } from "@/types/ai-assistant.types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { Button } from "@/components/ui/button";
import { Loader2, Speaker, Square } from "lucide-react";

interface AIAssistantMessageProps {
  message: AIMessage;
}

export function AIAssistantMessage({ message }: AIAssistantMessageProps) {
  const isUser = message.role === "user";
  const isMobile = useIsMobile();
  const { speak, stopSpeaking, isSpeaking } = useVoiceInteraction();

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (!isUser) {
      speak(message.content);
    }
  };

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
        
        {!isUser && (
          <div className="flex justify-end pr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSpeakerClick}
              className="h-6 w-6 rounded-full opacity-50 hover:opacity-100"
              title={isSpeaking ? "Stop speaking" : "Read message"}
            >
              {isSpeaking ? (
                <Square className="h-3 w-3 text-red-500" />
              ) : (
                <Speaker className="h-3 w-3" />
              )}
              <span className="sr-only">{isSpeaking ? "Stop reading" : "Read message"}</span>
            </Button>
          </div>
        )}
      </div>
      
      {isUser && !isMobile && <MessageAvatar isUser={isUser} />}
    </div>
  );
}
