
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { InputToolbar } from './InputToolbar';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { useGlobalChat } from '@/hooks/useGlobalChat';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CameraIcon, Loader2, Send, X } from 'lucide-react';
import { generateUUID } from '@/lib/utils/uuid';
import { CameraModal } from '../camera/CameraModal';
import { FilePreview } from './FilePreview';
import { processFile } from '@/lib/utils/fileProcessor';

interface AIMessageInputProps {
  activeMode: any; // Use the proper type from your types file
}

export const AIMessageInput = ({ activeMode }: AIMessageInputProps) => {
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useGlobalChat();
  const { currentPersonality } = useAIPersonality();
  const { toast } = useToast();
  
  // File and image state
  const [files, setFiles] = useState<Array<{
    file: File, 
    preview: string | null, 
    isProcessing?: boolean,
    status?: string
  }>>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isProcessing,
    error,
    supportsVoice
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    if (!message.trim() && files.length === 0) return;
    
    try {
      // If there are files, process them first
      if (files.length > 0) {
        // Handle file uploads
        const filePromises = files.map(async (fileObj) => {
          // Set processing state
          updateFileStatus(fileObj.file.name, true, "Processing file...");
          
          try {
            const processedFile = await processFile(fileObj.file);
            
            let promptPrefix = "";
            if (processedFile.type === 'image') {
              promptPrefix = "Analyze this image: ";
            } else if (processedFile.type === 'document' || processedFile.type === 'pdf') {
              promptPrefix = "Analyze this document: ";
            } else if (processedFile.type === 'text') {
              promptPrefix = "Analyze this text: ";
            }
            
            updateFileStatus(fileObj.file.name, true, "File ready");
            
            const filePrompt = message.trim() 
              ? message.trim()
              : `${promptPrefix}${fileObj.file.name}`;
              
            await sendMessage(filePrompt);
          } catch (error) {
            console.error("Error processing file:", error);
            toast({
              title: "Error",
              description: "Failed to process file. Please try again.",
              variant: "destructive",
            });
          } finally {
            // Clear processing state
            updateFileStatus(fileObj.file.name, false);
          }
        });
        
        await Promise.all(filePromises);
      } else {
        // Regular text message
        await sendMessage(message.trim());
      }
      
      // Clear state
      setMessage("");
      setFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
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
  
  const handleFileSelected = async (file: File) => {
    try {
      // Process file to get preview
      const processedFile = await processFile(file);
      
      // Add file to state
      setFiles(prev => [
        ...prev, 
        { 
          file, 
          preview: processedFile.preview,
          isProcessing: false
        }
      ]);
      
      toast({
        title: "File Added",
        description: `${file.name} ready to send`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const updateFileStatus = (fileName: string, isProcessing?: boolean, status?: string) => {
    setFiles(prev => prev.map(fileObj => {
      if (fileObj.file.name === fileName) {
        return { ...fileObj, isProcessing, status };
      }
      return fileObj;
    }));
  };
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(fileObj => fileObj.file.name !== fileName));
  };
  
  const handleImageCapture = (file: File, preview: string) => {
    setFiles(prev => [...prev, { file, preview, isProcessing: false }]);
    setIsCameraOpen(false);
    
    toast({
      title: "Photo Captured",
      description: "Photo ready to send",
    });
  };
  
  const openCamera = () => {
    if (supportsVoice) {
      setIsCameraOpen(true);
    } else {
      toast({
        title: "Camera Not Available",
        description: "Your browser doesn't support camera access",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="message-input-container relative">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* File previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 space-y-2"
            >
              {files.map((fileObj) => (
                <FilePreview
                  key={fileObj.file.name}
                  file={fileObj.file}
                  previewUrl={fileObj.preview}
                  onRemove={() => removeFile(fileObj.file.name)}
                  isProcessing={fileObj.isProcessing}
                  processingStatus={fileObj.status}
                />
              ))}
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
                if (message.trim() || files.length > 0) {
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
              disabled={(files.length === 0 && !message.trim()) || isLoading}
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
          onImageCapture={openCamera}
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.md"
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            handleFileSelected(files[0]);
            e.target.value = '';
          }}
        />
        
        {/* Camera Modal */}
        <CameraModal 
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleImageCapture}
        />
      </form>
    </div>
  );
};
