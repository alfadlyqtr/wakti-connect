
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Paperclip, Mic, MicOff, X } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { toast } from '@/components/ui/use-toast';

interface InputToolbarProps {
  isLoading: boolean;
  isListening: boolean;
  onVoiceToggle: () => void;
  onFileSelected?: (file: File) => void;
  onImageCapture?: () => void;
}

export const InputToolbar = ({ 
  isLoading, 
  isListening, 
  onVoiceToggle,
  onFileSelected,
  onImageCapture
}: InputToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { supportsVoice } = useVoiceInteraction({
    onTranscriptComplete: () => {}
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log('File to process:', file);
    
    setSelectedFile(file);
    
    if (onFileSelected) {
      onFileSelected(file);
      toast({
        title: "File Selected",
        description: `Selected ${file.name}`,
      });
    }
    
    e.target.value = '';
  };
  
  const handleCameraCapture = () => {
    console.log('Opening camera');
    if (onImageCapture) {
      onImageCapture();
    } else {
      toast({
        title: "Camera",
        description: "Camera functionality is coming soon!",
      });
    }
  };

  // Enhanced 3D button style with deeper shadows and brighter highlights
  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(12px)',
    transform: 'perspective(1000px) rotateX(2deg)',
    transition: 'all 0.3s ease',
  };

  const activeButtonStyle = {
    background: 'rgba(239, 68, 68, 0.15)',
    boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3) inset, 0 0 20px rgba(239, 68, 68, 0.5)',
    transform: 'perspective(1000px) rotateX(2deg)',
  };

  const buttonSize = isMobile ? "h-10 w-10" : "h-12 w-12";

  return (
    <div className="toolbar-container flex items-center justify-start w-full pt-2 pb-2 overflow-x-auto no-scrollbar">
      <div className="flex flex-row gap-3 sm:gap-4 items-center">
        {/* Camera button */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -4 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCameraCapture}
            disabled={isLoading || isListening}
            className={`${buttonSize} rounded-full bg-white/10 dark:bg-black/50 text-blue-600 border border-blue-100/30 dark:border-blue-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-blue-50/20 dark:hover:bg-blue-900/30 transition-all`}
            style={buttonStyle}
          >
            <Camera className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="sr-only">Take a photo</span>
          </Button>
        </motion.div>
        
        {/* File upload button */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -4 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isListening}
            className={`${buttonSize} rounded-full bg-white/10 dark:bg-black/50 text-blue-600 border border-blue-100/30 dark:border-blue-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-blue-50/20 dark:hover:bg-blue-900/30 transition-all`}
            style={buttonStyle}
          >
            <Paperclip className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="sr-only">Upload a file</span>
          </Button>
        </motion.div>
        
        {/* Voice input button */}
        {supportsVoice && (
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={isListening ? { 
              scale: [1, 1.1, 1],
              transition: { repeat: Infinity, duration: 1.5 }
            } : {}}
          >
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "ghost"}
              onClick={onVoiceToggle}
              className={cn(
                `${buttonSize} rounded-full shadow-xl hover:shadow-2xl transition-all`,
                isListening 
                  ? "bg-red-500/90 text-white border border-red-400/70 animate-pulse dark:bg-red-700/80"
                  : "bg-white/10 dark:bg-black/50 text-blue-600 border border-blue-100/30 dark:border-blue-900/50 hover:bg-blue-50/20 dark:hover:bg-blue-900/30"
              )}
              style={isListening ? activeButtonStyle : buttonStyle}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              )}
              <span className="sr-only">
                {isListening ? "Stop recording" : "Start recording"}
              </span>
            </Button>
          </motion.div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
      
      {selectedFile && (
        <div className="ml-2 flex items-center bg-primary/10 px-2 py-1 rounded-full">
          <span className="text-xs truncate max-w-[150px]">{selectedFile.name}</span>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-5 w-5 ml-1"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
