
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LocationPicker from "@/components/events/location/LocationPicker";
import { generateGoogleMapsUrl } from "@/config/maps";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendLocation: (location: string) => Promise<void>;
  canShareLocation: boolean;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onSendLocation,
  canShareLocation,
  isSending
}) => {
  const [messageContent, setMessageContent] = useState("");
  const [sendingLocation, setSendingLocation] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim() || isSending) return;
    
    try {
      await onSendMessage(messageContent.trim());
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendLocation = async () => {
    if (!locationValue || isSending) return;
    
    try {
      await onSendLocation(locationValue);
      setLocationValue("");
      setSendingLocation(false);
    } catch (error) {
      console.error("Failed to send location:", error);
    }
  };

  return (
    <form 
      onSubmit={handleSendMessage} 
      className="border-t p-4 flex gap-2"
    >
      <Input
        placeholder="Type a message (max 20 chars)"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        maxLength={20}
        className="flex-1"
      />
      
      {canShareLocation && (
        <Popover open={sendingLocation} onOpenChange={setSendingLocation}>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Share Location</h3>
              <LocationPicker
                value={locationValue}
                onChange={(value) => setLocationValue(value)}
                placeholder="Search for a location"
              />
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleSendLocation}
                  disabled={!locationValue.trim()}
                  size="sm"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Send Location
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      <Button 
        type="submit" 
        disabled={!messageContent.trim() || isSending}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
