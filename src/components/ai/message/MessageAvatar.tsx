
import React from "react";
import { Bot, User } from "lucide-react";

interface MessageAvatarProps {
  isUser: boolean;
}

export function MessageAvatar({ isUser }: MessageAvatarProps) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
      isUser 
        ? "bg-gray-300 text-gray-600" 
        : "bg-wakti-blue text-white"
    }`}>
      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
    </div>
  );
}
