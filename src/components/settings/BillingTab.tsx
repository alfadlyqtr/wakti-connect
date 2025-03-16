
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface BillingTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const BillingTab: React.FC<BillingTabProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          Manage your subscription and billing details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg capitalize">{profile?.account_type || 'Free'} Plan</h3>
            <Badge variant="outline" className="capitalize">{profile?.account_type || 'Free'}</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            {profile?.account_type === 'business' 
              ? 'Full access to all business features including staff management, job tracking, and analytics.' 
              : profile?.account_type === 'individual'
              ? 'Enhanced personal productivity tools and unlimited task storage.'
              : 'Basic features with limited storage.'}
          </p>
          <Button>Upgrade Plan</Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Payment Method</h3>
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>•••• •••• •••• 4242</span>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Billing History</h3>
          <div className="border rounded-md divide-y">
            <div className="p-3 flex justify-between">
              <div>
                <p className="font-medium">April 2023</p>
                <p className="text-sm text-muted-foreground">Plan: Business</p>
              </div>
              <p className="font-medium">$45.00</p>
            </div>
            <div className="p-3 flex justify-between">
              <div>
                <p className="font-medium">March 2023</p>
                <p className="text-sm text-muted-foreground">Plan: Business</p>
              </div>
              <p className="font-medium">$45.00</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
