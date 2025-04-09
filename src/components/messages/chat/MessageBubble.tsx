
import React from "react";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isCurrentUser }) => {
  // Define different styles for current user vs other users
  const bubbleClass = isCurrentUser
    ? "bg-primary text-primary-foreground" 
    : "bg-muted";
  
  return (
    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${bubbleClass}`}>
      <p className="break-words whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default MessageBubble;
