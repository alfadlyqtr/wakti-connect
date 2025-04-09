
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  displayName: string;
  avatarUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, avatarUrl }) => {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar>
        <AvatarImage src={avatarUrl || ""} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold">{displayName}</h2>
      </div>
    </div>
  );
};

export default ChatHeader;
