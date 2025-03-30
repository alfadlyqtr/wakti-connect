
import React from 'react';
import { HeartIcon } from 'lucide-react';
import BusinessSubscribeButton from './BusinessSubscribeButton';
import { cn } from '@/lib/utils';

interface FloatingSubscribeButtonProps {
  businessId: string;
  visible: boolean;
  showButton: boolean;
  isAuthenticated: boolean | null;
  onAuthRequired: () => boolean;
  buttonStyle?: React.CSSProperties;
  size?: "default" | "sm" | "lg";
}

const FloatingSubscribeButton: React.FC<FloatingSubscribeButtonProps> = ({
  businessId,
  visible,
  showButton,
  isAuthenticated,
  onAuthRequired,
  buttonStyle,
  size
}) => {
  if (!showButton) return null;
  
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300",
      visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
    )}>
      <BusinessSubscribeButton
        businessId={businessId}
        customText="Subscribe"
        buttonStyle={{
          ...buttonStyle,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        size={size}
        className="rounded-full px-6"
        onAuthRequired={onAuthRequired}
      />
    </div>
  );
};

export default FloatingSubscribeButton;
