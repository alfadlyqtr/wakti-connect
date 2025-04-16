
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface VoiceButtonProps {
  isListening: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isLoading,
  isDisabled,
  onToggle
}) => {
  const isMobile = useIsMobile();
  
  return (
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
        onClick={onToggle}
        disabled={isLoading || isDisabled}
        className={cn(
          isMobile ? "h-11 w-11" : "h-12 w-12",
          "rounded-full transition-all duration-300 shadow-2xl transform hover:translate-y-[-8px]",
          isListening 
            ? "bg-red-500/20 border-red-500/30" 
            : "bg-white/10 dark:bg-black/50 border border-blue-100/30 dark:border-blue-900/50 backdrop-blur-xl",
          isListening
            ? "hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(239,68,68,0.5)]"
            : "hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(59,130,246,0.5)]",
          "active:translate-y-[-2px] perspective-1000 rotateX-2 origin-bottom"
        )}
      >
        {isListening ? (
          <MicOff className="h-5 w-5 text-red-400" />
        ) : (
          <Mic className="h-5 w-5 text-blue-400" />
        )}
      </Button>
    </motion.div>
  );
};
