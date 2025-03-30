
import React from "react";
import { Button } from "@/components/ui/button";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, Bell, BellOff } from "lucide-react";

interface BusinessSubscribeButtonProps {
  businessId: string;
  customText?: string;
}

const BusinessSubscribeButton: React.FC<BusinessSubscribeButtonProps> = ({
  businessId,
  customText = "Subscribe" // Default text for the subscribe button
}) => {
  const { 
    isSubscribed, 
    checkingSubscription, 
    subscribe, 
    unsubscribe 
  } = useBusinessSubscribers(businessId);
  
  const handleClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  };
  
  if (checkingSubscription) {
    return (
      <Button variant="outline" disabled className="min-w-[120px]">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }
  
  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      className={isSubscribed ? "bg-muted/20" : ""}
      onClick={handleClick}
      disabled={subscribe.isPending || unsubscribe.isPending}
    >
      {subscribe.isPending || unsubscribe.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
        </>
      ) : (
        <>
          {isSubscribed ? (
            <BellOff className="h-4 w-4 mr-2" />
          ) : (
            <Bell className="h-4 w-4 mr-2" />
          )}
          {isSubscribed ? "Unsubscribe" : customText}
        </>
      )}
    </Button>
  );
};

export default BusinessSubscribeButton;
