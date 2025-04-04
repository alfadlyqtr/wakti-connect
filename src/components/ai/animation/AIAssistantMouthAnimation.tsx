
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Laugh, Smile, Meh, Frown, Volume2, VolumeX } from "lucide-react";

interface AIAssistantMouthAnimationProps {
  isActive: boolean;
  isSpeaking?: boolean;
  mood?: "happy" | "neutral" | "thinking" | "sad";
  size?: "small" | "medium" | "large";
}

export const AIAssistantMouthAnimation: React.FC<AIAssistantMouthAnimationProps> = ({
  isActive,
  isSpeaking = false,
  mood = "neutral",
  size = "medium"
}) => {
  const [animationState, setAnimationState] = useState(0);
  
  // Animation effect - more frequent updates for smoother animation
  useEffect(() => {
    if (!isActive || !isSpeaking) return;
    
    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 4);
    }, 150); // Faster animation for more natural movement
    
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
        // More expressive mouth states animation
        if (animationState === 0) return <Smile className="h-full w-full text-wakti-blue" />;
        if (animationState === 1) return <Meh className="h-full w-full text-wakti-blue" />;
        if (animationState === 2) return <Smile className="h-full w-full text-wakti-blue" />;
        return <Laugh className="h-full w-full text-wakti-blue" />;
      }
      
      return <Smile className="h-full w-full text-wakti-blue" />;
    }
  };

  // Get size classes based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "h-10 w-10",
          indicator: "h-5 w-5"
        };
      case "large":
        return {
          container: "h-24 w-24",
          indicator: "h-8 w-8"
        };
      case "medium":
      default:
        return {
          container: "h-16 w-16",
          indicator: "h-6 w-6"
        };
    }
  };

  const sizeClasses = getSizeClasses();
  
  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
        className={`${sizeClasses.container} rounded-full bg-white border-2 border-wakti-blue/20 flex items-center justify-center shadow-sm`}
      >
        {getMouthIcon()}
      </motion.div>
      
      {/* Sound indicator */}
      {isSpeaking ? (
        <motion.div 
          className={`absolute -right-1 -bottom-1 ${sizeClasses.indicator} bg-green-100 rounded-full flex items-center justify-center`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <Volume2 className="h-3/5 w-3/5 text-green-600" />
        </motion.div>
      ) : (
        <div className={`absolute -right-1 -bottom-1 ${sizeClasses.indicator} bg-gray-100 rounded-full flex items-center justify-center`}>
          <VolumeX className="h-3/5 w-3/5 text-gray-400" />
        </div>
      )}
    </div>
  );
};
