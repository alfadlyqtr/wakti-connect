
import React, { useState, useEffect, useRef } from 'react';
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
  const confettiAnimationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up animations and timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (confettiAnimationRef.current) {
        cancelAnimationFrame(confettiAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (show) {
      setShowAnimation(true);
      
      // Run confetti when completing a task ahead of time
      if (isAheadOfTime) {
        const duration = 1500; // Reduced from 2000 for performance
        const end = Date.now() + duration;
        let frame = 0;

        const launchConfetti = () => {
          // Limit the number of confetti particles for better performance
          confetti({
            particleCount: 30, // Reduced from 50
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4CAF50', '#2196F3', '#FFEB3B'],
            disableForReducedMotion: true
          });
          
          if (Date.now() < end) {
            // Limit animation frames to reduce CPU usage
            frame++;
            if (frame % 2 === 0) { // Only render every other frame
              confettiAnimationRef.current = requestAnimationFrame(launchConfetti);
            }
          }
        };
        
        // Start confetti with reduced frequency
        launchConfetti();
      }
      
      // Hide animation after delay with cleanup
      timerRef.current = setTimeout(() => {
        setShowAnimation(false);
        // Clean up confetti animation if it's still running
        if (confettiAnimationRef.current) {
          cancelAnimationFrame(confettiAnimationRef.current);
          confettiAnimationRef.current = null;
        }
        // Notify parent component that animation is complete
        onAnimationComplete();
      }, isAheadOfTime ? 1500 : 1000); // Shorter duration for better performance
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        if (confettiAnimationRef.current) {
          cancelAnimationFrame(confettiAnimationRef.current);
        }
      };
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
            className="flex flex-col items-center p-6 bg-card rounded-xl shadow-xl" // Reduced padding for less visual weight
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {isAheadOfTime ? (
              <>
                {/* Passport stamp design for ahead-of-time completion - simplified */}
                <motion.div
                  className="relative mb-3 p-5 border-4 border-amber-600 rounded-full overflow-hidden bg-amber-50"
                  animate={{ 
                    rotate: [0, 10, -10, 0], // Simplified animation
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.8, repeat: 0 }} // Reduced animation repetition
                >
                  <div className="absolute inset-0 bg-amber-50 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-amber-600 rounded-full"></div>
                  
                  <div className="relative z-10 text-center">
                    <Award size={32} className="mx-auto text-amber-600 mb-1" /> {/* Reduced size */}
                    <div className="text-amber-800 font-bold text-sm">EARLY</div>
                    <div className="text-amber-800 text-xs">{new Date().toLocaleDateString()}</div>
                  </div>
                </motion.div>
                <h2 className="text-lg font-bold mb-1 text-center">Amazing Work!</h2>
                <p className="text-center text-muted-foreground text-sm">
                  Task completed ahead of schedule!
                </p>
              </>
            ) : (
              <>
                {/* Passport stamp design for regular completion - simplified */}
                <motion.div
                  className="relative mb-3 p-5 border-4 border-green-600 rounded-full overflow-hidden bg-green-50"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 0 }} // Reduced animation repetition
                >
                  <div className="absolute inset-0 bg-green-50 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-green-600 rounded-full"></div>
                  
                  <div className="relative z-10 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-green-600 mb-1" /> {/* Reduced size */}
                    <div className="text-green-800 font-bold text-sm">COMPLETED</div>
                    <div className="text-green-800 text-xs">{new Date().toLocaleDateString()}</div>
                  </div>
                </motion.div>
                <h2 className="text-lg font-bold mb-1">Task Completed!</h2>
                <p className="text-center text-muted-foreground text-sm">
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
