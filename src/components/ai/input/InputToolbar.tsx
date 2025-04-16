
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Paperclip, Mic, MicOff } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InputToolbarProps {
  isLoading: boolean;
  isListening: boolean;
  onVoiceToggle: () => void;
}

export const InputToolbar = ({ isLoading, isListening, onVoiceToggle }: InputToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { supportsVoice } = useVoiceInteraction({
    onTranscriptComplete: () => {}
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    console.log('File to process:', files[0]);
    e.target.value = '';
  };
  
  const handleCameraCapture = () => {
    console.log('Opening camera');
  };

  const commonButtonStyle = {
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
    transform: 'perspective(1000px) rotateX(2deg)'
  };

  const activeButtonStyle = {
    boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3) inset, 0 0 20px rgba(239, 68, 68, 0.5)',
    transform: 'perspective(1000px) rotateX(2deg)'
  };

  return (
    <div className="toolbar-container flex flex-wrap items-center justify-end gap-2 sm:gap-3 w-full pt-2">
      {/* Camera button */}
      <motion.div 
        whileHover={{ scale: 1.05, y: -4 }} 
        whileTap={{ scale: 0.95 }}
        className="filter drop-shadow-xl"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCameraCapture}
          disabled={isLoading || isListening}
          className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/50 text-blue-600 border border-blue-100 dark:border-blue-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          style={commonButtonStyle}
        >
          <Camera className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span className="sr-only">Take a photo</span>
        </Button>
      </motion.div>
      
      {/* File upload button */}
      <motion.div 
        whileHover={{ scale: 1.05, y: -4 }} 
        whileTap={{ scale: 0.95 }}
        className="filter drop-shadow-xl"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isListening}
          className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/50 text-blue-600 border border-blue-100 dark:border-blue-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          style={commonButtonStyle}
        >
          <Paperclip className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span className="sr-only">Upload a file</span>
        </Button>
      </motion.div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
      
      {/* Voice input button */}
      {supportsVoice && (
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="filter drop-shadow-xl"
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
              "h-10 w-10 rounded-full shadow-xl hover:shadow-2xl transition-all",
              isListening 
                ? "bg-red-500/90 text-white border border-red-400/70 animate-pulse dark:bg-red-700/80"
                : "bg-white/90 dark:bg-black/50 text-blue-600 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            )}
            style={isListening ? activeButtonStyle : commonButtonStyle}
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
  );
};
