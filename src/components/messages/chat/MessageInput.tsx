
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, MapPin } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendLocation?: (location: string) => Promise<void>;
  canShareLocation?: boolean;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onSendLocation, 
  canShareLocation = false,
  isSending
}) => {
  const [message, setMessage] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      try {
        await onSendMessage(message.trim());
        setMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation || !canShareLocation || !onSendLocation) {
      return;
    }
    
    setIsGettingLocation(true);
    
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          await onSendLocation(locationString);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setIsGettingLocation(false);
        }
      );
    } catch (error) {
      console.error("Error sharing location", error);
      setIsGettingLocation(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20} // Apply 20 character limit
        />
        <div className="absolute right-3 bottom-1 text-xs text-muted-foreground">
          {message.length > 0 && `${message.length}/20`}
        </div>
      </div>
      
      {canShareLocation && onSendLocation && (
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleShareLocation}
          disabled={isGettingLocation || isSending}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || isSending}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
