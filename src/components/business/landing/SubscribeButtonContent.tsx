
import React from 'react';
import { Loader2, Heart, BellOff } from 'lucide-react';

interface SubscribeButtonContentProps {
  isLoading: boolean;
  isPending: boolean;
  isSubscribed: boolean;
  iconOnly: boolean;
  iconPosition: "left" | "right" | "none";
  customText: string;
}

const SubscribeButtonContent: React.FC<SubscribeButtonContentProps> = ({
  isLoading,
  isPending,
  isSubscribed,
  iconOnly,
  iconPosition,
  customText
}) => {
  if (isLoading || isPending) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        {!iconOnly && (isSubscribed ? " Unsubscribing..." : " Subscribing...")}
      </>
    );
  }

  if (isSubscribed) {
    return (
      <>
        {iconOnly ? 
          <BellOff className="h-4 w-4" /> : 
          (iconPosition === "left" ? <BellOff className="h-4 w-4 mr-2" /> : null)
        }
        {!iconOnly && "Unsubscribe"}
        {!iconOnly && iconPosition === "right" && <BellOff className="h-4 w-4 ml-2" />}
      </>
    );
  }

  return (
    <>
      {iconOnly ? 
        <Heart className="h-4 w-4" /> : 
        (iconPosition === "left" ? <Heart className="h-4 w-4 mr-2" /> : null)
      }
      {!iconOnly && customText}
      {!iconOnly && iconPosition === "right" && <Heart className="h-4 w-4 ml-2" />}
    </>
  );
};

export default SubscribeButtonContent;
