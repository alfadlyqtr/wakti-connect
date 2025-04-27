
import React, { useState } from "react";
import { isValid } from "date-fns";
import { Play, Pause, ExternalLink } from "lucide-react";
import { isMessageExpired } from "@/utils/messageExpiration";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { safeFormatDistanceToNow } from "@/utils/safeFormatters";

interface MessageBubbleProps {
  content: string;
  type?: 'text' | 'voice' | 'image';
  isCurrentUser: boolean;
  senderName?: string;
  timestamp: string;
  audioUrl?: string;
  imageUrl?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  type = 'text',
  isCurrentUser, 
  senderName = 'User',
  timestamp,
  audioUrl,
  imageUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Safe date formatting with our utility function
  const formattedTime = safeFormatDistanceToNow(timestamp, "Recently");
  
  // Check if message has expired
  if (isMessageExpired(timestamp)) {
    return null;
  }
  
  const toggleAudio = () => {
    if (!audioUrl) return;
    
    if (!audioElement) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);
      setAudioElement(audio);
    }
    
    if (isPlaying) {
      audioElement?.pause();
    } else {
      audioElement?.play();
    }
  };
  
  return (
    <div className={`relative max-w-[85%] group`}>
      <div className={`
        p-3 rounded-lg break-words
        ${isCurrentUser 
          ? 'bg-primary text-primary-foreground ml-auto' 
          : 'bg-muted'}
      `}>
        {/* Display sender name if not current user */}
        {!isCurrentUser && (
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            {senderName}
          </div>
        )}
        
        {/* Content based on message type */}
        {type === 'text' && (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
        
        {type === 'voice' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleAudio}
              className={`rounded-full p-1.5 ${isCurrentUser ? 'bg-primary-foreground/20 hover:bg-primary-foreground/30' : 'bg-background hover:bg-accent'}`}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            
            {/* Audio waveform visualization (simplified) */}
            <div className="flex-1 h-8 bg-black/10 rounded-md overflow-hidden flex items-center px-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-${Math.floor(Math.random() * 5) + 1} w-1 mx-0.5 rounded-full ${isCurrentUser ? 'bg-primary-foreground/60' : 'bg-foreground/60'}`}
                />
              ))}
            </div>
            
            {/* Audio duration from content */}
            <div className="text-xs opacity-80">{content}</div>
          </div>
        )}
        
        {type === 'image' && (
          <>
            <div 
              className="relative cursor-pointer" 
              onClick={() => setImageOpen(true)}
            >
              <img 
                src={imageUrl} 
                alt="Message attachment" 
                className="max-h-48 rounded-md object-cover w-full"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                <ExternalLink className="h-6 w-6 text-white drop-shadow-md" />
              </div>
            </div>
            
            {content && (
              <div className="mt-2 text-sm">{content}</div>
            )}
            
            <Dialog open={imageOpen} onOpenChange={setImageOpen}>
              <DialogContent className="max-w-3xl">
                <img 
                  src={imageUrl} 
                  alt="Message attachment" 
                  className="w-full h-auto object-contain"
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      
      {/* Timestamp */}
      <div className={`text-[10px] mt-1 text-muted-foreground ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        {formattedTime}
      </div>
    </div>
  );
};

export default MessageBubble;
