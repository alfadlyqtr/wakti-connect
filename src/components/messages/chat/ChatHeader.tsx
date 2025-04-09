
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  displayName: string;
  avatarUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, avatarUrl }) => {
  // Create initials from display name for the avatar fallback
  const getInitials = (name: string): string => {
    if (!name) return "?";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar>
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
      </Avatar>
      
      <div>
        <h2 className="font-semibold">{displayName}</h2>
      </div>
    </div>
  );
};

export default ChatHeader;
