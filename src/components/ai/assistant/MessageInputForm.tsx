
import React, { useState, useRef } from "react";
import { Send, Paperclip, Camera, Mic, XCircle, ImagePlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((inputMessage.trim() || uploadedFiles.length > 0) && !isLoading && canAccess) {
        handleSendMessage(e);
        setUploadedFiles([]);
      }
    }
  };

  const autoGrowTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    autoGrowTextarea();
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageCapture = () => {
    imageInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // For simplicity in this implementation, we'll just store the files
      // In a real implementation, you'd process these files for content extraction
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
      
      // You would typically call a service here to extract text from the files
      // For now, we'll simulate this by adding a placeholder text
      const fileNames = Array.from(files).map(file => file.name).join(", ");
      setInputMessage(prev => 
        `${prev}${prev ? '\n' : ''}[Analyzing files: ${fileNames}]`
      );
      
      // Clear the input to allow uploading the same file again
      e.target.value = '';
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t p-3 shadow-sm bg-white"
    >
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex flex-wrap gap-2"
          >
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                {file.type.includes('image') ? 
                  <ImagePlus className="h-3 w-3" /> : 
                  <FileText className="h-3 w-3" />
                }
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => removeFile(index)}
                  className="hover:text-red-500"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none pr-32 py-2 min-h-[40px] max-h-[150px] rounded-lg bg-muted/30"
          disabled={isLoading || !canAccess}
        />
        
        <div className="absolute right-2 top-1.5 flex space-x-1">
          <AnimatePresence>
            {showMediaOptions && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 bg-green-50 text-green-600 hover:bg-green-100"
                          onClick={handleImageCapture}
                          disabled={isLoading || !canAccess}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Take or upload photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 bg-purple-50 text-purple-600 hover:bg-purple-100"
                          onClick={handleFileUpload}
                          disabled={isLoading || !canAccess}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                  disabled={isLoading || !canAccess}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach media</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
          
          <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
          />
          
          {inputMessage && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setInputMessage("")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="h-7 w-7 bg-wakti-blue hover:bg-wakti-blue/80 disabled:bg-muted-foreground/20"
            disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading || !canAccess}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-center text-muted-foreground">
        WAKTI AI can make mistakes. Consider checking important information.
      </div>
    </form>
  );
};
