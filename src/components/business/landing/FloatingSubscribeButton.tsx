
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, BellOff } from "lucide-react";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";

interface FloatingSubscribeButtonProps {
  businessId: string;
  visible: boolean;
  showButton: boolean;
  isAuthenticated: boolean | null;
  onAuthRequired: () => void;
  buttonStyle?: React.CSSProperties;
}

const FloatingSubscribeButton: React.FC<FloatingSubscribeButtonProps> = ({
  businessId,
  visible,
  showButton,
  isAuthenticated,
  onAuthRequired,
  buttonStyle
}) => {
  const { 
    isSubscribed, 
    checkingSubscription, 
    subscribe, 
    unsubscribe 
  } = useBusinessSubscribers(businessId);
  
  if (!visible || !showButton) return null;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
      <Button 
        size="sm"
        style={buttonStyle}
        className="rounded-full shadow-lg text-white hover:scale-105 transition-transform"
        onClick={handleClick}
        disabled={subscribe.isPending || unsubscribe.isPending || checkingSubscription}
      >
        {checkingSubscription ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubscribed ? (
          <BellOff className="h-4 w-4" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default FloatingSubscribeButton;
