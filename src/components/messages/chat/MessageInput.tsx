
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
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
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    await onSendMessage(message);
    setMessage("");
  };

  const handleSendLocation = async () => {
    if (!locationInput.trim() || isSending) return;
    
    if (onSendLocation) {
      await onSendLocation(locationInput);
    }
    
    setLocationInput("");
    setIsLocationDialogOpen(false);
  };

  return (
    <div className="border-t p-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {canShareLocation && onSendLocation && (
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Enter location or address</Label>
                    <Input
                      id="location"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="e.g. 123 Main St, City, Country"
                    />
                  </div>
                  <Button 
                    onClick={handleSendLocation}
                    disabled={!locationInput.trim() || isSending}
                    className="w-full"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Share Location</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isSending}
          className="flex-1"
        />
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
