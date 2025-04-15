
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
    
    // In a real implementation, you'd process the file and send it to the AI
    console.log('File to process:', files[0]);
    
    // Reset the input
    e.target.value = '';
  };
  
  const handleCameraCapture = () => {
    // This would open the camera in a real implementation
    console.log('Opening camera');
  };

  return (
    <div className="absolute right-2 bottom-2 flex items-center gap-2">
      {/* Camera button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCameraCapture}
          disabled={isLoading || isListening}
          className="h-9 w-9 rounded-full bg-white/30 border border-white/30 backdrop-blur-sm dark:bg-slate-800/30 dark:border-slate-700/30 shadow-md hover:shadow-lg hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
        >
          <Camera className="h-4 w-4" />
          <span className="sr-only">Take a photo</span>
        </Button>
      </motion.div>
      
      {/* File upload button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isListening}
          className="h-9 w-9 rounded-full bg-white/30 border border-white/30 backdrop-blur-sm dark:bg-slate-800/30 dark:border-slate-700/30 shadow-md hover:shadow-lg hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
        >
          <Paperclip className="h-4 w-4" />
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
          whileHover={{ scale: 1.05 }}
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
              "h-9 w-9 rounded-full shadow-md hover:shadow-lg transition-all",
              isListening 
                ? "bg-red-500/90 text-white border border-red-400/70 animate-pulse"
                : "bg-white/30 border border-white/30 backdrop-blur-sm dark:bg-slate-800/30 dark:border-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40"
            )}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
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
