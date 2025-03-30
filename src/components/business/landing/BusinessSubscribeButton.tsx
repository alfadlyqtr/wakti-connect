
import React from "react";
import { Button } from "@/components/ui/button";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, Heart, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessSubscribeButtonProps {
  businessId: string;
  customText?: string;
  buttonStyle?: React.CSSProperties;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "gradient";
  iconOnly?: boolean;
  className?: string;
  onAuthRequired?: () => boolean;
}

const BusinessSubscribeButton: React.FC<BusinessSubscribeButtonProps> = ({
  businessId,
  customText = "Subscribe",
  buttonStyle,
  size = "default",
  variant = "default",
  iconOnly = false,
  className,
  onAuthRequired
}) => {
  const { 
    isSubscribed, 
    checkingSubscription, 
    subscribe, 
    unsubscribe 
  } = useBusinessSubscribers(businessId);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if authentication is required and the function returns false
    if (onAuthRequired && !onAuthRequired()) {
      return;
    }
    
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  };
  
  if (checkingSubscription) {
    return (
      <Button 
        variant="outline" 
        size={size}
        disabled 
        className={cn("min-w-[120px]", className)}
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        {!iconOnly && "Loading..."}
      </Button>
    );
  }
  
  return (
    <Button
      variant={variant === "gradient" ? "default" : (isSubscribed ? "outline" : variant)}
      size={size}
      className={cn(
        isSubscribed ? "bg-muted/20" : "",
        "transition-all hover:shadow-md",
        className
      )}
      style={buttonStyle}
      onClick={handleClick}
      disabled={subscribe.isPending || unsubscribe.isPending}
    >
      {subscribe.isPending || unsubscribe.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && (isSubscribed ? " Unsubscribing..." : " Subscribing...")}
        </>
      ) : (
        <>
          {isSubscribed ? (
            <>
              {iconOnly ? <BellOff className="h-4 w-4" /> : <BellOff className="h-4 w-4 mr-2" />}
              {!iconOnly && "Unsubscribe"}
            </>
          ) : (
            <>
              {iconOnly ? <Heart className="h-4 w-4" /> : <Heart className="h-4 w-4 mr-2" />}
              {!iconOnly && customText}
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default BusinessSubscribeButton;
