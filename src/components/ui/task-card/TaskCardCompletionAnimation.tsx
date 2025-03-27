
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (show) {
      setShowAnimation(true);
      
      // Run confetti when completing a task ahead of time
      if (isAheadOfTime) {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        const launchConfetti = () => {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4CAF50', '#2196F3', '#FFEB3B'],
            disableForReducedMotion: true
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(launchConfetti);
          }
        };
        
        launchConfetti();
      }
      
      // Hide animation after delay
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onAnimationComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, isAheadOfTime, onAnimationComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center p-8 bg-card rounded-xl shadow-xl"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {isAheadOfTime ? (
              <>
                {/* Passport stamp design for ahead-of-time completion */}
                <motion.div
                  className="relative mb-4 p-6 border-4 border-amber-600 rounded-full overflow-hidden bg-amber-50"
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  <div className="absolute inset-0 bg-amber-50 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-amber-600 rounded-full"></div>
                  
                  <div className="relative z-10 text-center">
                    <Award size={40} className="mx-auto text-amber-600 mb-1" />
                    <div className="text-amber-800 font-bold text-sm">EARLY</div>
                    <div className="text-amber-800 text-xs">{new Date().toLocaleDateString()}</div>
                  </div>
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold mb-2 text-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  Amazing Work! 
                </motion.h2>
                <p className="text-center text-muted-foreground">
                  Task completed ahead of schedule!
                </p>
              </>
            ) : (
              <>
                {/* Passport stamp design for regular completion */}
                <motion.div
                  className="relative mb-4 p-6 border-4 border-green-600 rounded-full overflow-hidden bg-green-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  <div className="absolute inset-0 bg-green-50 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-green-600 rounded-full"></div>
                  
                  <div className="relative z-10 text-center">
                    <CheckCircle2 size={40} className="mx-auto text-green-600 mb-1" />
                    <div className="text-green-800 font-bold text-sm">COMPLETED</div>
                    <div className="text-green-800 text-xs">{new Date().toLocaleDateString()}</div>
                  </div>
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold mb-2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  Task Completed!
                </motion.h2>
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
