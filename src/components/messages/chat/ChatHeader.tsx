
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  displayName: string;
  avatarUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, avatarUrl }) => {
  return (
    <div className="p-4 border-b flex items-center">
      <Avatar className="mr-2">
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback>{displayName[0]}</AvatarFallback>
      </Avatar>
      <h2 className="font-semibold">{displayName}</h2>
    </div>
  );
};

export default ChatHeader;
