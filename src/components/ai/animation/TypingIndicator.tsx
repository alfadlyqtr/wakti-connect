
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-2 w-2 bg-current rounded-full"
          initial={{ opacity: 0.4, y: 0 }}
          animate={{ 
            opacity: [0.4, 1, 0.4], 
            y: ["0%", "-50%", "0%"] 
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            delay: dot * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
