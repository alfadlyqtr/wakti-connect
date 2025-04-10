
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Mic, Image, X, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useToast } from '@/components/ui/use-toast';
import VoiceRecorder from './VoiceRecorder';
import { supabase } from '@/integrations/supabase/client';

interface MessageComposerProps {
  onSendMessage: (content: string | null, type?: 'text' | 'voice' | 'image', audioUrl?: string, imageUrl?: string) => void;
  isDisabled?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onSendMessage,
  isDisabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const MAX_MESSAGE_LENGTH = 300;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  
  const handleSendTextMessage = async () => {
    if (!message.trim() || isDisabled || isSending) return;
    
    try {
      setIsSending(true);
      await onSendMessage(message, 'text');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSendImageMessage = async () => {
    if (!imageFile || isDisabled || isSending) return;
    
    try {
      setIsSending(true);
      
      // Upload image to Supabase storage
      const { data: imageData, error: imageError } = await supabase.storage
        .from('message_attachments')
        .upload(`images/${Date.now()}_${imageFile.name}`, imageFile);
        
      if (imageError) {
        throw imageError;
      }
      
      const { data: imagePubUrlData } = supabase.storage
        .from('message_attachments')
        .getPublicUrl(imageData.path);
        
      const imageUrl = imagePubUrlData.publicUrl;
      
      // Send message with image - pass null for content
      await onSendMessage(null, 'image', undefined, imageUrl);
      
      // Clear form
      setMessage('');
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error sending image message:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleVoiceRecordingComplete = async (audioBlob: Blob, audioDuration: string) => {
    if (isDisabled) return;
    
    try {
      setIsSending(true);
      
      // Upload audio to Supabase storage
      const { data: audioData, error: audioError } = await supabase.storage
        .from('message_attachments')
        .upload(`voice/${Date.now()}.webm`, audioBlob);
        
      if (audioError) {
        throw audioError;
      }
      
      const { data: audioPubUrlData } = supabase.storage
        .from('message_attachments')
        .getPublicUrl(audioData.path);
        
      const audioUrl = audioPubUrlData.publicUrl;
      
      // Send voice message - pass null for content
      await onSendMessage(null, 'voice', audioUrl);
      setIsRecording(false);
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload voice message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    // Check file size
    if (selectedFile.size > MAX_IMAGE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Image size must be less than 2MB',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if file is image
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Only image files are supported',
        variant: 'destructive'
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    setImageFile(selectedFile);
    e.target.value = ''; // Reset input
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (imageFile) {
        handleSendImageMessage();
      } else {
        handleSendTextMessage();
      }
    }
  };
  
  // Show voice recorder if recording
  if (isRecording) {
    return (
      <VoiceRecorder 
        onRecordingComplete={handleVoiceRecordingComplete}
        onCancel={() => setIsRecording(false)}
        maxDuration={30}
      />
    );
  }
  
  return (
    <div className="space-y-3">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative rounded-md overflow-hidden border">
          <img 
            src={imagePreview} 
            alt="Selected image" 
            className="w-full h-auto max-h-40 object-cover"
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
      
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            placeholder={`Type your message... (${MAX_MESSAGE_LENGTH} chars max)`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[45px] max-h-[120px] resize-none pr-16 py-2"
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isDisabled || isSending}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </div>
        </div>
        
        {/* Media buttons */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDisabled || isSending}
            onClick={() => setIsRecording(true)}
            title="Voice message"
            className="h-9 w-9"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDisabled || isSending}
            onClick={handleFileSelect}
            title="Upload image"
            className="h-9 w-9"
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
          
          {/* Send button */}
          <Button
            type="button"
            disabled={(!message.trim() && !imageFile) || isDisabled || isSending}
            onClick={imageFile ? handleSendImageMessage : handleSendTextMessage}
            size="icon"
            className="h-9 w-9"
          >
            {isSending ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {isMobile && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> 
          Press send button to submit
        </p>
      )}
    </div>
  );
};

export default MessageComposer;
