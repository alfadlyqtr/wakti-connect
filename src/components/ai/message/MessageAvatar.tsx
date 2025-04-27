
import React from "react";
import { Bot, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageAvatarProps {
  isUser: boolean;
  className?: string;
}

export function MessageAvatar({ isUser, className }: MessageAvatarProps) {
  const { user } = useAuth();
  
  // Get the avatar URL or user initials
  const userAvatarUrl = user?.user_metadata?.avatar_url || null;
  const userInitial = user?.user_metadata?.full_name?.[0] || 
                    user?.user_metadata?.name?.[0] || 
                    user?.email?.[0]?.toUpperCase() || 'U';
  
  return (
    <Avatar className={`w-8 h-8 rounded-full flex-shrink-0 ${
      isUser 
        ? "bg-gray-200" 
        : "bg-wakti-blue"
    } ${className || ''}`}>
      {isUser ? (
        <>
          <AvatarImage src={userAvatarUrl || ''} alt="User" />
          <AvatarFallback className="text-gray-600 text-sm">
            {userInitial}
          </AvatarFallback>
        </>
      ) : (
        <AvatarFallback className="bg-wakti-blue">
          <Bot className="h-4 w-4 text-white" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
