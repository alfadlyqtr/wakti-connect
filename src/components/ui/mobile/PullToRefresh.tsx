
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformHapticFeedback } from '@/utils/hapticFeedback';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  pullDistance?: number;
  backgroundColor?: string;
  loadingColor?: string;
  className?: string;
  pulledClassName?: string;
  refreshingClassName?: string;
  pulledText?: string;
  refreshingText?: string;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  pullDistance = 120,
  backgroundColor = 'bg-background',
  loadingColor = 'text-primary',
  className = '',
  pulledClassName = '',
  refreshingClassName = '',
  pulledText = 'Release to refresh',
  refreshingText = 'Refreshing...',
  disabled = false
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [pulled, setPulled] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(true);
  
  useEffect(() => {
    enabled.current = !disabled;
  }, [disabled]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled.current || refreshing || !containerRef.current) return;
    
    // Only enable pull-to-refresh if at the top of the container
    if (containerRef.current.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enabled.current || refreshing || startY.current === 0) return;
    
    currentY.current = e.touches[0].clientY;
    const pullLength = Math.max(0, currentY.current - startY.current);
    
    // Apply diminishing returns the further you pull
    const adjustedLength = Math.min(pullDistance * 1.5, Math.pow(pullLength, 0.8));
    
    // Only allow pulling down
    if (pullLength > 0) {
      controls.set({ y: adjustedLength });
      
      // Check if we've pulled enough to trigger refresh
      if (pullLength > pullDistance && !pulled) {
        setPulled(true);
        platformHapticFeedback('impact');
      } else if (pullLength <= pullDistance && pulled) {
        setPulled(false);
      }
    }
  };
  
  const handleTouchEnd = async () => {
    if (!enabled.current || startY.current === 0) return;
    
    // Reset start position
    startY.current = 0;
    
    if (pulled) {
      // Transition to refreshing state
      setPulled(false);
      setRefreshing(true);
      platformHapticFeedback('success');
      
      // Snap to loading position
      controls.start({ y: 80 });
      
      try {
        // Call refresh function
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
        platformHapticFeedback('error');
      }
      
      // Complete refreshing state after animation
      setTimeout(() => {
        setRefreshing(false);
        controls.start({ y: 0 });
      }, 500);
    } else {
      // Spring back if not pulled enough
      controls.start({ y: 0 });
    }
  };
  
  return (
    <div
      className="relative overflow-hidden touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Pull indicator */}
      <motion.div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center z-10",
          backgroundColor,
          className,
          pulled && pulledClassName,
          refreshing && refreshingClassName,
          "h-16"
        )}
        animate={controls}
        initial={{ y: -80 }}
      >
        <div className="flex items-center">
          {refreshing ? (
            <>
              <RefreshCw className={cn("mr-2 h-5 w-5 animate-spin", loadingColor)} />
              <span>{refreshingText}</span>
            </>
          ) : (
            <>
              <ArrowDown className={cn("mr-2 h-5 w-5", pulled ? "rotate-180 transition-transform" : "")} />
              <span>{pulled ? pulledText : "Pull down to refresh"}</span>
            </>
          )}
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div animate={controls}>
        {children}
      </motion.div>
    </div>
  );
};
