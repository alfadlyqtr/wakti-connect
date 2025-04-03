
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Laugh, Smile, Meh, Frown, Volume2, VolumeX } from "lucide-react";

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  isSpeaking?: boolean;
  mood?: "happy" | "neutral" | "thinking" | "sad";
}

export const AIAssistantMouthAnimation: React.FC<AIAssistantMouthAnimationProps> = ({
  isActive,
  isSpeaking = false,
  mood = "neutral"
}) => {
  const [animationState, setAnimationState] = useState(0);
  
  // Animation effect
  useEffect(() => {
    if (!isActive || !isSpeaking) return;
    
    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 4);
    }, 200);
    
    return () => clearInterval(interval);
  }, [isActive, isSpeaking]);
  
  // Get the appropriate mouth icon based on mood and animation state
  const getMouthIcon = () => {
    if (!isActive) return <Meh className="h-full w-full text-gray-300" />;
    
    if (mood === "happy") {
      return <Laugh className="h-full w-full text-green-500" />;
    } else if (mood === "thinking") {
      return <Meh className="h-full w-full text-blue-500" />;
    } else if (mood === "sad") {
      return <Frown className="h-full w-full text-red-500" />;
    } else {
      // Neutral mood with speaking animation
      if (isSpeaking) {
        // Alternate between different mouth states for animation
        if (animationState === 0) return <Smile className="h-full w-full text-wakti-blue" />;
        if (animationState === 1) return <Meh className="h-full w-full text-wakti-blue" />;
        if (animationState === 2) return <Smile className="h-full w-full text-wakti-blue" />;
        return <Laugh className="h-full w-full text-wakti-blue" />;
      }
      
      return <Smile className="h-full w-full text-wakti-blue" />;
    }
  };
  
  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
        className="h-10 w-10 rounded-full bg-white border-2 border-wakti-blue/20 flex items-center justify-center shadow-sm"
      >
        {getMouthIcon()}
      </motion.div>
      
      {isSpeaking ? (
        <motion.div 
          className="absolute -right-1 -bottom-1 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Volume2 className="h-3 w-3 text-green-600" />
        </motion.div>
      ) : (
        <div className="absolute -right-1 -bottom-1 h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center">
          <VolumeX className="h-3 w-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};
