
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

  const buttonStyle = {
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
    transform: 'perspective(1000px) rotateX(1deg)'
  };

  const activeButtonStyle = {
    boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3) inset, 0 0 20px rgba(239, 68, 68, 0.5)',
    transform: 'perspective(1000px) rotateX(1deg)'
  };

  return (
    <div className="absolute right-3 bottom-3 flex items-center gap-2">
      {/* Camera button */}
      <motion.div 
        whileHover={{ scale: 1.1, y: -8 }} 
        whileTap={{ scale: 0.95 }}
        className="filter drop-shadow-xl"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCameraCapture}
          disabled={isLoading || isListening}
          className="h-10 w-10 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl dark:bg-slate-800/30 dark:border-slate-700/20 shadow-xl hover:shadow-2xl hover:bg-black/50 dark:hover:bg-slate-700/50 transition-all transform hover:translate-y-[-8px]"
          style={buttonStyle}
        >
          <Camera className="h-5 w-5 text-blue-400" />
          <span className="sr-only">Take a photo</span>
        </Button>
      </motion.div>
      
      {/* File upload button */}
      <motion.div 
        whileHover={{ scale: 1.1, y: -8 }} 
        whileTap={{ scale: 0.95 }}
        className="filter drop-shadow-xl"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isListening}
          className="h-10 w-10 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl dark:bg-slate-800/30 dark:border-slate-700/20 shadow-xl hover:shadow-2xl hover:bg-black/50 dark:hover:bg-slate-700/50 transition-all transform hover:translate-y-[-8px]"
          style={buttonStyle}
        >
          <Paperclip className="h-5 w-5 text-blue-400" />
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
          whileHover={{ scale: 1.1, y: -8 }}
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
              "h-10 w-10 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:translate-y-[-8px]",
              isListening 
                ? "bg-red-500/90 text-white border border-red-400/70 animate-pulse"
                : "bg-black/30 border border-white/10 backdrop-blur-xl dark:bg-slate-800/30 dark:border-slate-700/20 hover:bg-black/50 dark:hover:bg-slate-700/50"
            )}
            style={isListening ? activeButtonStyle : buttonStyle}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5 text-blue-400" />
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
