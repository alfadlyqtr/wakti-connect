
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
      // This only handles text messages
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
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 text-sm md:text-base py-6"
          disabled={isSending}
        />

        <div className="flex justify-between items-center">
          {canShareLocation && onSendLocation && (
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  disabled={isSending}
                  className="h-10 w-10 rounded-full"
                >
                  <MapPin className="h-5 w-5" />
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
                      className="text-sm md:text-base"
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
            disabled={!message.trim() || isSending}
            className="ml-auto rounded-full px-5"
          >
            {isSending ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
