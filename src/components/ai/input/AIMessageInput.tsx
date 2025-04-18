import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { InputToolbar } from './InputToolbar';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CameraIcon, Loader2, Send, X } from 'lucide-react';
import { generateUUID } from '@/lib/utils/uuid';

interface AIMessageInputProps {
  activeMode: any; // Use the proper type from your types file
}

export const AIMessageInput = ({ activeMode }: AIMessageInputProps) => {
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useGlobalChat();
  const { currentPersonality } = useAIPersonality();
  const { toast: toastMessage } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isProcessing,
    error
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setMessage(prev => prev + " " + text);
      }
    }
  });
  
  // Clear transcript function - define it locally since it's not in the hook
  const clearTranscript = () => {
    // This is needed because the hook doesn't provide this function
    // We just need to handle transcript changes in our effect
    console.log("Transcript cleared locally");
  };
  
  // Camera ref for handling camera capture
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Update rows based on content
  useEffect(() => {
    if (!textareaRef.current) return;
    
    // Reset height to get the correct scrollHeight
    textareaRef.current.style.height = 'auto';
    
    // Calculate new height
    const newRows = Math.min(
      Math.max(
        Math.ceil(textareaRef.current.scrollHeight / 24), // Assuming line height ~= 24px
        1
      ),
      5 // Max 5 rows
    );
    
    setRows(newRows);
    
    // Set the height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [message]);
  
  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(prev => {
        const newMessage = prev ? prev + " " + transcript : transcript;
        return newMessage;
      });
      // We don't call clearTranscript because our hook doesn't provide it
      // The hook will handle clearing internally
    }
  }, [transcript]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !imageFile) return;
    
    try {
      // If there's an image, process it
      if (imageFile) {
        // Handle image upload logic here
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          if (event.target?.result) {
            const imageDataUrl = event.target.result.toString();
            // Send the message with image prompt
            const imagePrompt = message.trim() 
              ? `Generate an image based on: ${message.trim()}`
              : `Analyze this image and respond with insights`;
              
            await sendMessage(imagePrompt);
            
            // Reset state
            setImageFile(null);
            setImagePreview(null);
            setMessage("");
          }
        };
        
        reader.readAsDataURL(imageFile);
        return;
      }
      
      // Regular text message
      await sendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toastMessage({
        title: "Error",
        description: "Failed to send message. Please try again.",
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
  
  const handleFileSelected = (file: File) => {
    // Check if file is an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      // Handle other file types if needed
      toast({
        title: "File Type Not Supported",
        description: "Only image files are currently supported.",
        variant: "destructive"
      });
    }
  };
  
  const handleImageCapture = () => {
    // Trigger the file input for camera
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };
  
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    handleFileSelected(file);
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="message-input-container relative">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Image preview */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative mb-2 rounded-lg overflow-hidden border border-border"
            >
              <img 
                src={imagePreview} 
                alt="Selected image" 
                className="w-full max-h-60 object-contain" 
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="input-row relative">
          <Textarea
            ref={textareaRef}
            placeholder={`Ask ${currentPersonality.name || "WAKTI"} anything...`}
            className={cn(
              "w-full min-h-[50px] resize-none py-3 px-4 pr-16 bg-background/80 backdrop-blur-sm transition-all",
              isListening && "bg-red-50/30 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
            )}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (message.trim() || imageFile) {
                  handleSubmit(e);
                }
              }
            }}
            rows={rows}
            disabled={isLoading || isListening}
          />
          
          <div className="absolute right-3 bottom-3">
            <Button 
              type="submit" 
              size="icon" 
              disabled={(!message.trim() && !imageFile) || isLoading}
              className={cn(
                "h-9 w-9 rounded-full transition-all shadow-md",
                isLoading ? "bg-muted" : ""
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <InputToolbar 
          isLoading={isLoading} 
          isListening={isListening} 
          onVoiceToggle={toggleVoiceRecording}
          onFileSelected={handleFileSelected}
          onImageCapture={handleImageCapture}
        />
        
        {/* Hidden camera input */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleCameraCapture}
        />
      </form>
    </div>
  );
};
