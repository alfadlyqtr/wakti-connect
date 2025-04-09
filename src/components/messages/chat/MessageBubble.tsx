
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
  senderName?: string;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isCurrentUser, senderName, timestamp }) => {
  // Format the timestamp
  const formattedTime = timestamp ? format(new Date(timestamp), 'h:mm a') : '';
  
  // Check if content is a location (contains Location: and URL)
  const isLocation = content.startsWith('Location:') && content.includes('https://www.google.com/maps');
  
  // Extract location and URL if it's a location message
  let locationText = '';
  let locationUrl = '';
  
  if (isLocation) {
    const lines = content.split('\n');
    if (lines.length >= 2) {
      locationText = lines[0].replace('Location:', '').trim();
      locationUrl = lines[1].trim();
    }
  }

  return (
    <div className={cn(
      "max-w-[75%] rounded-lg py-2 px-3",
      isCurrentUser 
        ? "bg-primary text-primary-foreground" 
        : "bg-muted border border-border"
    )}>
      {!isCurrentUser && senderName && (
        <div className="text-xs font-medium mb-1">
          {senderName}
        </div>
      )}
      
      {isLocation ? (
        <div className="space-y-1">
          <div className="font-medium text-sm">📍 {locationText}</div>
          <a 
            href={locationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "text-xs underline block",
              isCurrentUser ? "text-primary-foreground/80" : "text-blue-500"
            )}
          >
            View on Google Maps
          </a>
        </div>
      ) : (
        <div className="whitespace-pre-wrap">{content}</div>
      )}
      
      {timestamp && (
        <div className={cn(
          "text-[10px] mt-1",
          isCurrentUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-right"
        )}>
          {formattedTime}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
