
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onSendLocation?: (location: string) => void;
  canShareLocation?: boolean;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendLocation,
  canShareLocation = false,
  isSending
}) => {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleLocationSubmit = () => {
    if (location.trim() && onSendLocation) {
      onSendLocation(location.trim());
      setLocation('');
      setIsLocationDialogOpen(false);
    }
  };

  return (
    <div className="p-3 border-t bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
          disabled={isSending}
        />

        {canShareLocation && onSendLocation && (
          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                type="button" 
                size="icon" 
                variant="outline"
                disabled={isSending}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Location</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location (e.g., Doha, Qatar)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleLocationSubmit}
                  disabled={!location.trim()}
                >
                  Share Location
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
