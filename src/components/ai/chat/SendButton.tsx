
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SendButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  isActive: boolean;
}

export const SendButton: React.FC<SendButtonProps> = ({
  isLoading,
  isDisabled,
  isActive
}) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        type="submit" 
        size="icon" 
        disabled={!isActive || isLoading || isDisabled}
        className={cn(
          isMobile ? "h-11 w-11" : "h-12 w-12",
          "rounded-full transition-all duration-300 shadow-xl transform hover:translate-y-[-8px]",
          "bg-white/10 dark:bg-black/50 border border-blue-100/30 dark:border-blue-900/50 backdrop-blur-xl",
          "hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(59,130,246,0.5)]",
          "active:translate-y-[-2px]",
          "transition-transform perspective-1000 rotateX-2 origin-bottom",
          "glass-button"
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 15px rgba(59, 130, 246, 0.3)',
          transform: 'perspective(1000px) rotateX(2deg)',
        }}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        ) : (
          <Send className="h-5 w-5 text-blue-400" />
        )}
      </Button>
    </motion.div>
  );
};
