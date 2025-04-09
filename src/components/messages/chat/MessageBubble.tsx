
import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isCurrentUser }) => {
  // Check if the message is a Google Maps location
  const isLocationMessage = content.includes("https://maps.google.com") || 
                          content.includes("https://www.google.com/maps");

  return (
    <div
      className={cn(
        "max-w-md py-2 px-3 rounded-lg",
        isCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      {isLocationMessage ? (
        <div>
          <p className="mb-1">Shared location:</p>
          <a 
            href={content.match(/(https:\/\/[^\s]+)/)?.[0] || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "underline",
              isCurrentUser ? "text-primary-foreground" : "text-blue-600"
            )}
          >
            View on Google Maps
          </a>
        </div>
      ) : (
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};

export default MessageBubble;
