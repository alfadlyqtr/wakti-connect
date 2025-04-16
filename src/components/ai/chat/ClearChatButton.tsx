
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ClearChatButtonProps {
  isDisabled: boolean;
  onClick: () => void;
}

export const ClearChatButton: React.FC<ClearChatButtonProps> = ({
  isDisabled,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        type="button" 
        size="icon" 
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          "h-12 w-12 rounded-full transition-all duration-300 shadow-xl transform hover:translate-y-[-8px]",
          "bg-white/10 dark:bg-black/50 border border-red-100/30 dark:border-red-900/50 backdrop-blur-xl",
          "hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(239,68,68,0.5)]",
          "hover:bg-red-500/20 active:translate-y-[-2px]",
          "transition-transform perspective-1000 rotateX-2 origin-bottom",
          "glass-button"
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 15px rgba(239, 68, 68, 0.3)',
          transform: 'perspective(1000px) rotateX(2deg)',
        }}
      >
        <Trash2 className="h-5 w-5 text-red-400" />
      </Button>
    </motion.div>
  );
};
