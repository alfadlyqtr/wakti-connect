
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award } from 'lucide-react';
import { playTaskCompletionSound } from '@/utils/audioUtils';

interface TaskCardCompletionAnimationProps {
  show: boolean;
  isAheadOfTime: boolean;
  onAnimationComplete: () => void;
}

export const TaskCardCompletionAnimation: React.FC<TaskCardCompletionAnimationProps> = ({
  show,
  isAheadOfTime,
  onAnimationComplete
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  // Use clean callback to ensure proper closure
  const handleClose = useCallback(() => {
    setShowAnimation(false);
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (show) {
      setShowAnimation(true);
      
      // Play completion sound once - no looping
      playTaskCompletionSound(0.7);
      
      // Auto close after 3 seconds (reduced from 5)
      timer = setTimeout(handleClose, 3000);
    }
    
    // Clean up timer when unmounting or when show changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, handleClose]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative flex flex-col items-center p-8 bg-card rounded-xl shadow-xl"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          >
            {isAheadOfTime ? (
              <>
                <motion.div
                  className="text-yellow-500 mb-4"
                >
                  <Award size={60} className="text-wakti-gold" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2 text-center">
                  Amazing Work!
                </h2>
                <p className="text-center text-muted-foreground">
                  Task completed ahead of schedule!
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="text-green-500 mb-4"
                >
                  <CheckCircle2 size={60} />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">
                  Task Completed!
                </h2>
                <p className="text-center text-muted-foreground">
                  Well done on completing your task
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
