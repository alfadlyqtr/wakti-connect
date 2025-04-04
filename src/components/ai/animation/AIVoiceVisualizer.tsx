
import React from 'react';
import { motion } from 'framer-motion';

interface AIVoiceVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const AIVoiceVisualizer: React.FC<AIVoiceVisualizerProps> = ({
  isActive,
  isSpeaking,
}) => {
  // Don't render anything if not active or not speaking
  if (!isActive || !isSpeaking) return null;
  
  return (
    <div className="flex items-center justify-center h-8 gap-1.5">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-wakti-blue h-full w-2 rounded-full"
          initial={{ scaleY: 0.2 }}
          animate={{ 
            scaleY: [0.2, 0.8, 0.4, 1, 0.3, 0.7, 0.2],
            opacity: [0.6, 1, 0.8, 1, 0.7, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
          style={{ originY: 1 }}
        />
      ))}
    </div>
  );
};
