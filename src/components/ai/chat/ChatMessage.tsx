
import React from 'react';
import { ChatMemoryMessage } from "@/components/ai/personality-switcher/types";
import { MessageContent } from "../message/MessageContent";
import { MessageAvatar } from "../message/MessageAvatar";

interface ChatMessageProps {
  message: ChatMemoryMessage;
  mode: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, mode }) => {
  // Determine the class of the message based on the mode and sender
  const userMessage = message.role === 'user';

  let bubbleClass = "";
  if (userMessage) {
    switch (mode) {
      case "general":
        bubbleClass = "bg-blue-500/30 border-blue-400/40 text-white";
        break;
      case "student":
        bubbleClass = "bg-green-500/30 border-green-400/40 text-white";
        break;
      case "productivity":
        bubbleClass = "bg-purple-500/30 border-purple-400/40 text-white";
        break;
      case "creative":
        bubbleClass = "bg-pink-500/30 border-pink-400/40 text-white";
        break;
      default:
        bubbleClass = "bg-blue-500/30 border-blue-400/40 text-white";
    }
  } else {
    switch (mode) {
      case "general":
        bubbleClass = "bg-blue-950/40 border-blue-800/30 text-white";
        break;
      case "student":
        bubbleClass = "bg-green-950/40 border-green-800/30 text-white";
        break;
      case "productivity":
        bubbleClass = "bg-purple-950/40 border-purple-800/30 text-white";
        break;
      case "creative":
        bubbleClass = "bg-pink-950/40 border-pink-800/30 text-white";
        break;
      default:
        bubbleClass = "bg-blue-950/40 border-blue-800/30 text-white";
    }
  }

  return (
    <div className={`flex items-start gap-4 mb-4 ${userMessage ? "justify-end" : "justify-start"}`}>
      {!userMessage && <MessageAvatar isUser={false} />}
      <div className={`p-3 rounded-lg border ${bubbleClass} max-w-[80%]`}>
        <MessageContent content={message.content} timestamp={message.timestamp} isUser={userMessage} />
      </div>
      {userMessage && <MessageAvatar isUser={true} />}
    </div>
  );
};
