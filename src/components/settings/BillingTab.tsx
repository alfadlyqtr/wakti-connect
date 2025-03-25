
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BillingTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const BillingTab: React.FC<BillingTabProps> = ({ profile }) => {
  const navigate = useNavigate();
  
  const handleUpgradePlan = () => {
    navigate("/dashboard/upgrade");
    toast({
      title: "Redirecting to plan selection",
      description: "You'll now be able to choose your preferred plan."
    });
  };
  
  const handleChangePayment = () => {
    // In a real app, this would open a payment method change dialog
    toast({
      title: "Feature in development",
      description: "Payment method changes are coming soon."
    });
  };
  
  // Map account_type to display name and description
  const getPlanInfo = () => {
    const planType = profile?.account_type || 'free';
    
    switch(planType) {
      case 'business':
        return {
          name: 'Business Plan',
          description: 'Full access to all business features including staff management, job tracking, analytics, and AI assistant.',
          price: 'QAR 45/month'
        };
      case 'individual':
        return {
          name: 'Individual Plan',
          description: 'Enhanced personal productivity tools, unlimited task storage, and AI assistant features.',
          price: 'QAR 20/month'
        };
      default:
        return {
          name: 'Free Plan',
          description: 'Basic features with limited storage.',
          price: 'Free'
        };
    }
  };
  
  const planInfo = getPlanInfo();
  
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          Manage your subscription and billing details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-4 sm:px-6">
        <div className="p-3 sm:p-4 border rounded-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h3 className="font-medium text-lg">{planInfo.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize w-fit">{profile?.account_type || 'Free'}</Badge>
              <span className="font-bold">{planInfo.price}</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            {planInfo.description}
          </p>
          <Button 
            className="w-full sm:w-auto"
            onClick={handleUpgradePlan}
          >
            {profile?.account_type === 'free' ? 'Upgrade Plan' : 'Change Plan'}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Payment Method</h3>
          <div className="p-3 sm:p-4 border rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>•••• •••• •••• 4242</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 sm:mt-0"
                onClick={handleChangePayment}
              >
                Change
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Billing History</h3>
          <div className="border rounded-md divide-y">
            <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
              <div>
                <p className="font-medium">April 2023</p>
                <p className="text-sm text-muted-foreground">Plan: {planInfo.name}</p>
              </div>
              <p className="font-medium">{profile?.account_type === 'business' ? 'QAR 45.00' : 
                                          profile?.account_type === 'individual' ? 'QAR 20.00' : 'QAR 0.00'}</p>
            </div>
            <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
              <div>
                <p className="font-medium">March 2023</p>
                <p className="text-sm text-muted-foreground">Plan: {planInfo.name}</p>
              </div>
              <p className="font-medium">{profile?.account_type === 'business' ? 'QAR 45.00' : 
                                          profile?.account_type === 'individual' ? 'QAR 20.00' : 'QAR 0.00'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
