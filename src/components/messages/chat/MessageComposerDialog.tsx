
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMessaging } from "@/hooks/useMessaging";

interface MessageComposerDialogProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  triggerElement?: React.ReactNode;
  onMessageSent?: () => void;
}

const MessageComposerDialog: React.FC<MessageComposerDialogProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  triggerElement,
  onMessageSent
}) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { sendMessage, isSending } = useMessaging({});
  
  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setMessage(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + text);
      }
    }
  });
  
  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    try {
      await sendMessage({ recipientId, content: message });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      
      setMessage("");
      setIsOpen(false);
      
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerElement || (
          <Button variant="outline" size="sm">
            Message
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
              {recipientAvatar ? (
                <img 
                  src={recipientAvatar} 
                  alt={recipientName} 
                  className="h-full w-full object-cover"
                />
              ) : (
                recipientName.charAt(0).toUpperCase()
              )}
            </div>
            <span>Message to {recipientName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`min-h-[120px] resize-none pr-10 ${isListening ? "bg-rose-50 border-rose-200" : ""}`}
            disabled={isSending || isListening}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          {isListening && (
            <span className="absolute right-3 top-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Messages expire after 24 hours. Press Enter to send, Shift+Enter for new line.
        </p>
        
        <div className="flex justify-between gap-2">
          <div className="flex items-center">
            {supportsVoice && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoiceRecording}
                disabled={isSending}
                className={isListening ? "text-rose-500" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSending}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isSending}
              className="flex items-center gap-1"
            >
              {isSending ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposerDialog;
