
import { useState, useRef } from 'react';

interface SwipeDirection {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface SwipeOptions {
  threshold?: number; // Minimum distance in pixels to detect a swipe
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  preventDefaultTouchmove?: boolean;
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * Hook to detect swipe gestures and trigger callback functions
 */
export const useSwipe = (options: SwipeOptions = {}): SwipeHandlers => {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp, 
    onSwipeDown,
    preventDefaultTouchmove = false
  } = options;
  
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    setIsSwiping(true);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    if (preventDefaultTouchmove) {
      e.preventDefault();
    }
    
    if (!touchStart.current) return;
    
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };
  
  const onTouchEnd = () => {
    setIsSwiping(false);
    
    if (!touchStart.current || !touchEnd.current) return;
    
    const distanceX = touchEnd.current.x - touchStart.current.x;
    const distanceY = touchEnd.current.y - touchStart.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    // Detect swipe direction
    const swipeDetected: SwipeDirection = {
      left: isHorizontalSwipe && distanceX < -threshold,
      right: isHorizontalSwipe && distanceX > threshold,
      up: !isHorizontalSwipe && distanceY < -threshold,
      down: !isHorizontalSwipe && distanceY > threshold
    };
    
    // Trigger the appropriate callback
    if (swipeDetected.left && onSwipeLeft) onSwipeLeft();
    if (swipeDetected.right && onSwipeRight) onSwipeRight();
    if (swipeDetected.up && onSwipeUp) onSwipeUp();
    if (swipeDetected.down && onSwipeDown) onSwipeDown();
    
    // Reset touch positions
    touchStart.current = null;
    touchEnd.current = null;
  };
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
