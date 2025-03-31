
import React from "react";
import { MapPin } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isCurrentUser }) => {
  const isLocationMessage = (message: string) => {
    return message.startsWith('📍') && message.includes('maps.google.com');
  };
  
  const formatLocationMessage = (message: string) => {
    const lines = message.split('\n');
    if (lines.length !== 2) return message;
    
    const locationName = lines[0].replace('📍 ', '');
    const mapsUrl = lines[1];
    
    return (
      <div>
        <div className="flex items-center mb-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{locationName}</span>
        </div>
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
    );
  };

  return (
    <div 
      className={`max-w-[75%] p-3 rounded-lg ${
        isCurrentUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}
    >
      {isLocationMessage(content) 
        ? formatLocationMessage(content) 
        : <p>{content}</p>}
    </div>
  );
};

export default MessageBubble;
