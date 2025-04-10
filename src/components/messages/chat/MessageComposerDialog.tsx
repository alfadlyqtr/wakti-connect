
import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Image, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMessaging } from "@/hooks/useMessaging";
import VoiceRecorder from "./VoiceRecorder";
import { supabase } from "@/integrations/supabase/client";

interface MessageComposerDialogProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  triggerElement?: React.ReactNode;
  onMessageSent?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MessageComposerDialog: React.FC<MessageComposerDialogProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  triggerElement,
  onMessageSent,
  open,
  onOpenChange
}) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isSending } = useMessaging({});
  
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setIsOpen(value);
    }
  };
  
  const MAX_MESSAGE_LENGTH = 300;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  
  const handleSendMessage = async (type: 'text' | 'voice' | 'image' = 'text', audioFile?: Blob, duration?: string) => {
    if (isSending) return;
    
    try {
      let messageContent: string | null = message.trim();
      let audioUrl: string | undefined;
      let imageUrl: string | undefined;
      
      if (type === 'voice' && audioFile) {
        const { data: audioData, error: audioError } = await supabase.storage
          .from('message_attachments')
          .upload(`voice/${Date.now()}.webm`, audioFile);
          
        if (audioError) {
          throw audioError;
        }
        
        const { data: audioPubUrlData } = supabase.storage
          .from('message_attachments')
          .getPublicUrl(audioData.path);
          
        audioUrl = audioPubUrlData.publicUrl;
        messageContent = null;
      }
      
      if (type === 'image' && imageFile) {
        if (imageFile.size > MAX_IMAGE_SIZE) {
          toast({
            title: "File too large",
            description: "Image size must be less than 2MB",
            variant: "destructive",
          });
          return;
        }
        
        const { data: imageData, error: imageError } = await supabase.storage
          .from('message_attachments')
          .upload(`images/${Date.now()}_${imageFile.name}`, imageFile);
          
        if (imageError) {
          throw imageError;
        }
        
        const { data: imagePubUrlData } = supabase.storage
          .from('message_attachments')
          .getPublicUrl(imageData.path);
          
        imageUrl = imagePubUrlData.publicUrl;
        messageContent = null;
        
        setImagePreview(null);
        setImageFile(null);
      }
      
      if (type === 'text') {
        if (!messageContent || messageContent.length > MAX_MESSAGE_LENGTH) {
          toast({
            title: "Invalid message",
            description: "Message cannot be empty or exceed 300 characters",
            variant: "destructive",
          });
          return;
        }
      }
      
      await sendMessage({ 
        recipientId, 
        content: messageContent,
        type,
        audioUrl,
        imageUrl
      });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. It will expire in 24 hours.",
      });
      
      setMessage("");
      setIsOpen(false);
      setIsRecording(false);
      
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
  
  const handleVoiceRecordingComplete = (audioBlob: Blob, audioDuration: string) => {
    handleSendMessage('voice', audioBlob, audioDuration);
  };
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast({
        title: "File too large",
        description: "Image size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are supported",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    setImageFile(selectedFile);
    e.target.value = '';
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {triggerElement && (
        <DialogTrigger asChild>
          {triggerElement}
        </DialogTrigger>
      )}
      
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
        
        {isRecording ? (
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={() => setIsRecording(false)}
            maxDuration={30}
          />
        ) : (
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Selected image" 
                  className="w-full h-auto max-h-40 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleClearImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="relative">
              <Textarea
                placeholder="Type your message here... (max 300 characters)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none pr-10"
                disabled={isSending}
                maxLength={MAX_MESSAGE_LENGTH}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Messages expire after 24 hours. Press Enter to send, Shift+Enter for new line.
            </p>
            
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRecording(true)}
                  disabled={isSending}
                  title="Record voice message"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleFileSelect}
                  disabled={isSending}
                  title="Add image"
                >
                  <Image className="h-4 w-4" />
                </Button>
                
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  onClick={() => {
                    if (imageFile) {
                      handleSendMessage('image');
                    } else {
                      handleSendMessage();
                    }
                  }}
                  disabled={(!message.trim() && !imageFile) || isSending}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageComposerDialog;
