
import React, { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { platformHapticFeedback } from '@/utils/hapticFeedback';

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  thresholdValue?: number;
  className?: string;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  thresholdValue = 0.4,
  className,
  disabled = false,
  hapticFeedback = true
}) => {
  const x = useMotionValue(0);
  const [swiping, setSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  
  // Transform values for background actions
  const leftActionOpacity = useTransform(
    x,
    [-200, -5],
    [1, 0]
  );
  
  const rightActionOpacity = useTransform(
    x,
    [5, 200],
    [0, 1]
  );
  
  const handleDragStart = () => {
    if (disabled) return;
    setSwiping(true);
    if (containerRef.current) {
      containerWidth.current = containerRef.current.getBoundingClientRect().width;
    }
  };
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    
    const thresholdDistance = containerWidth.current * thresholdValue;
    
    // Swipe left (positive velocity means right to left)
    if (info.offset.x < -thresholdDistance && onSwipeLeft) {
      onSwipeLeft();
      if (hapticFeedback) platformHapticFeedback('impact');
    } 
    // Swipe right (negative velocity means left to right)
    else if (info.offset.x > thresholdDistance && onSwipeRight) {
      onSwipeRight();
      if (hapticFeedback) platformHapticFeedback('impact');
    }
    
    // Reset position
    x.set(0);
    setSwiping(false);
  };
  
  return (
    <div 
      className={cn("relative overflow-hidden touch-manipulation", className)}
      ref={containerRef}
    >
      {/* Action backgrounds */}
      {leftAction && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end h-full">
          <motion.div 
            style={{ opacity: rightActionOpacity }}
            className="flex h-full items-center px-4 bg-green-500"
          >
            {rightAction}
          </motion.div>
        </div>
      )}
      
      {rightAction && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-start h-full">
          <motion.div 
            style={{ opacity: leftActionOpacity }}
            className="flex h-full items-center px-4 bg-red-500"
          >
            {leftAction}
          </motion.div>
        </div>
      )}
      
      {/* Swipeable content */}
      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceDamping: 20, bounceStiffness: 600 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn(
          "bg-background relative z-10",
          swiping && "cursor-grabbing"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};
