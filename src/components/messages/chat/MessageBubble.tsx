
import React from "react";
import { format, isToday, isYesterday } from "date-fns";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
  senderName?: string;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isCurrentUser,
  senderName,
  timestamp
}) => {
  // Parse timestamp for formatting
  const formattedTimestamp = timestamp ? formatTimestamp(timestamp) : '';
  
  return (
    <div
      className={`max-w-[75%] rounded-lg px-3 py-2 mb-1 ${
        isCurrentUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-muted text-foreground rounded-tl-none"
      }`}
    >
      {!isCurrentUser && senderName && (
        <div className="text-xs font-medium mb-1">{senderName}</div>
      )}
      <div className="break-words">{content}</div>
      {timestamp && (
        <div className={`text-xs mt-1 text-right ${
          isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}>
          {formattedTimestamp}
        </div>
      )}
    </div>
  );
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return '';
  }
};

export default MessageBubble;
