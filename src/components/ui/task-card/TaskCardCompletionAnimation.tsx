
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const handleClose = useCallback(() => {
    setShowAnimation(false);
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    if (show) {
      setShowAnimation(true);
      
      // Launch confetti with brand colors when completing a task
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ['#0053c3', '#ffc529', '#000080', '#F5E6D3'];

      const launchConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6, x: 0.5 },
          colors,
          shapes: ['circle', 'square'],
          gravity: 1.2,
          scalar: 1.2,
          disableForReducedMotion: true
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(launchConfetti);
        }
      };
      
      launchConfetti();
      
      // Play completion sound if available
      try {
        const audio = new Audio('/sounds/task-complete.mp3');
        audio.play().catch(e => console.log('Audio playback failed:', e));
      } catch (error) {
        console.log('Sound playback not supported');
      }
      
      // Auto close after 3 seconds
      const timer = setTimeout(handleClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, handleClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAnimation) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showAnimation, handleClose]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative flex flex-col items-center p-8 bg-card rounded-xl shadow-xl"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stamp-like overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ rotate: -15, scale: 2, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="border-4 border-green-500 rounded-full p-12 rotate-12">
                <CheckCircle2 size={80} className="text-green-500" />
              </div>
            </motion.div>

            {isAheadOfTime ? (
              <>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                  className="text-yellow-500 mb-4 relative z-10"
                >
                  <Award size={60} className="text-wakti-gold" />
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold mb-2 text-center relative z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  Amazing Work! 
                </motion.h2>
                <p className="text-center text-muted-foreground relative z-10">
                  Task completed ahead of schedule!
                </p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                  className="text-green-500 mb-4 relative z-10"
                >
                  <CheckCircle2 size={60} />
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold mb-2 relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  Task Completed!
                </motion.h2>
                <p className="text-center text-muted-foreground relative z-10">
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
