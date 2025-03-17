
import React from "react";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessSubscriptionsList = () => {
  const { 
    subscriptions, 
    isLoading, 
    subscriptionCount, 
    unsubscribe 
  } = useUserSubscriptions();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Business Subscriptions</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {subscriptionCount} {subscriptionCount === 1 ? 'subscription' : 'subscriptions'}
        </span>
      </div>

      {(subscriptions && subscriptions.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={subscription.business_profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {(subscription.business_profile?.business_name || "").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        to={`/business/${subscription.business_id}`} 
                        className="font-medium hover:underline text-primary"
                      >
                        {subscription.business_profile?.business_name || "Business"}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Subscribed: {new Date(subscription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => unsubscribe.mutate(subscription.id)}
                    disabled={unsubscribe.isPending}
                  >
                    {unsubscribe.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">You are not subscribed to any businesses</p>
          <p className="text-sm text-muted-foreground mt-2">
            Search for businesses to subscribe to their updates
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessSubscriptionsList;
