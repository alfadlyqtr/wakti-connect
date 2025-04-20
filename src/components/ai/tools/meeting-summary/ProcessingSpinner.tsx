
import React from 'react';
import { motion } from 'framer-motion';

interface ProcessingSpinnerProps {
  isVisible: boolean;
}

const ProcessingSpinner: React.FC<ProcessingSpinnerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div 
        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 relative">
          <div className="h-16 w-16 relative">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png"
              alt="WAKTI Logo"
              className="h-full w-full object-contain"
            />
            <motion.div 
              className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
        <p className="text-gray-700 font-medium">Processing your recording...</p>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingSpinner;
