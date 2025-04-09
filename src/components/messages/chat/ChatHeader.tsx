
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  displayName: string;
  avatarUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ displayName, avatarUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => navigate('/dashboard/messages')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div>
        <h3 className="font-medium">{displayName}</h3>
      </div>
    </div>
  );
};

export default ChatHeader;
