
import React from "react";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SubscribersListProps {
  businessId: string;
}

const SubscribersList = ({ businessId }: SubscribersListProps) => {
  const { 
    subscribers, 
    isLoading, 
    subscriberCount 
  } = useBusinessSubscribers(businessId);

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
        <h2 className="text-2xl font-bold">Subscribers</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
        </span>
      </div>

      {(subscribers && subscribers.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscribers.map((subscriber) => {
            // Safely access profile properties with fallbacks
            const avatarUrl = subscriber.profile?.avatar_url || '';
            const displayName = subscriber.profile?.display_name || '';
            const fullName = subscriber.profile?.full_name || '';
            const nameInitials = (displayName || fullName || "User").slice(0, 2).toUpperCase();
            const subscriberName = displayName || fullName || "User";
            
            return (
              <Card key={subscriber.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        {nameInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{subscriberName}</p>
                      <p className="text-sm text-muted-foreground">
                        Subscribed: {new Date(subscriber.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No subscribers yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Share your business page to gain subscribers
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscribersList;
