
import React from "react";
import { Button } from "@/components/ui/button";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface BusinessSubscribeButtonProps {
  businessId: string;
  customText?: string;
}

const BusinessSubscribeButton = ({ businessId, customText }: BusinessSubscribeButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    isSubscribed, 
    subscriptionId, 
    checkingSubscription,
    subscribe,
    unsubscribe
  } = useBusinessSubscribers(businessId);

  const handleSubscriptionAction = () => {
    if (!user) {
      navigate("/auth", { state: { from: window.location.pathname } });
      return;
    }

    if (isSubscribed && subscriptionId) {
      unsubscribe.mutate(subscriptionId);
    } else {
      subscribe.mutate(businessId);
    }
  };

  if (checkingSubscription) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSubscriptionAction}
      variant={isSubscribed ? "outline" : "default"}
      disabled={subscribe.isPending || unsubscribe.isPending}
    >
      {(subscribe.isPending || unsubscribe.isPending) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
        </>
      ) : (
        <>
          <Heart className={`mr-2 h-4 w-4 ${isSubscribed ? "fill-primary" : ""}`} />
          {isSubscribed ? (customText ? `Unsubscribe` : "Unsubscribe") : (customText || "Subscribe")}
        </>
      )}
    </Button>
  );
};

export default BusinessSubscribeButton;
