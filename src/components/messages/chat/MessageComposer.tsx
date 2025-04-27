
import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Mic, X, Loader2 } from "lucide-react";
import { Message } from "@/types/message.types";

interface MessageComposerProps {
  onSendMessage: (
    content: string | null, 
    type?: 'text' | 'voice' | 'image', 
    audioUrl?: string, 
    imageUrl?: string
  ) => void;
  isDisabled?: boolean;
  replyToMessage?: Message | null;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onSendMessage, 
  isDisabled = false,
  replyToMessage
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const handleSendTextMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        
        // In a real app, you'd upload this blob to storage and get a URL
        // For this demo, let's create a local object URL (not persistent)
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Format the recording time as MM:SS
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        onSendMessage(timeDisplay, 'voice', audioUrl);
        setRecordingTime(0);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer to track recording duration
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Don't process the audio data
      audioChunksRef.current = [];
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingTime(0);
    }
  };

  const handleImageSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // In a real app, you'd upload this to storage and get a URL
      // For this demo, let's create a local object URL (not persistent)
      const imageUrl = URL.createObjectURL(file);
      
      // Send the image message
      onSendMessage(null, 'image', undefined, imageUrl);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Format recording time as MM:SS
  const formattedRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {isRecording ? (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-red-50 dark:bg-red-950">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium flex-1">Recording... {formattedRecordingTime()}</span>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={stopRecording}
            className="text-green-600 border-green-600"
          >
            Send
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="outline"
            onClick={cancelRecording}
            className="text-red-600 border-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled || isUploading}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleImageSelection}
              disabled={isDisabled || isUploading}
              title="Send Image"
              className="text-muted-foreground"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Image className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onTouchStart={startRecording}
              onMouseDown={startRecording}
              onTouchEnd={stopRecording}
              onMouseUp={stopRecording}
              onMouseLeave={cancelRecording}
              disabled={isDisabled || isUploading}
              title="Record Audio"
              className="text-muted-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant={message.trim() ? "default" : "ghost"}
              onClick={handleSendTextMessage}
              disabled={!message.trim() || isDisabled || isUploading}
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MessageComposer;
