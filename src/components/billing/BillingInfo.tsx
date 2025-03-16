
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { BillingInfoType } from "./types";

interface BillingInfoProps {
  billingInfo: BillingInfoType;
  isLoading: boolean;
}

const BillingInfo = ({ billingInfo, isLoading }: BillingInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription canceled",
      description: "Your subscription has been canceled. You'll continue to have access until the end of your billing period.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>
          Your current subscription details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-wakti-gold" />
            <span className="font-medium text-lg capitalize">{billingInfo?.plan} Plan</span>
            <Badge variant="outline" className={
              billingInfo?.status === "active" ? "bg-green-500/10 text-green-500" :
              billingInfo?.status === "canceled" ? "bg-orange-500/10 text-orange-500" :
              "bg-red-500/10 text-red-500"
            }>
              {billingInfo?.status === "active" ? "Active" :
              billingInfo?.status === "canceled" ? "Canceled" :
              "Past Due"}
            </Badge>
          </div>
          {billingInfo?.amount > 0 && (
            <div>
              <span className="font-bold text-xl">${billingInfo?.amount}</span>
              <span className="text-muted-foreground">/{billingInfo?.interval}</span>
            </div>
          )}
        </div>
        
        {billingInfo?.plan !== "free" && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Current Period</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your subscription will {billingInfo?.status === "canceled" ? "end" : "renew"} on <span className="font-medium text-foreground">{formatDate(billingInfo?.currentPeriodEnd)}</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {billingInfo?.plan !== "free" && billingInfo?.status === "active" && (
          <Button variant="outline" onClick={handleCancelSubscription}>
            Cancel Subscription
          </Button>
        )}
        {(billingInfo?.plan === "free" || billingInfo?.status === "canceled") && (
          <Button>
            Upgrade Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BillingInfo;
