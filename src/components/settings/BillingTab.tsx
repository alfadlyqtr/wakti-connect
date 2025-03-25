
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, PaypalIcon, CreditCardIcon, DollarSign } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BillingTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const BillingTab: React.FC<BillingTabProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState<"creditcard" | "paypal">("creditcard");
  
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
  
  // Map account_type to display name, description and price
  const getPlanInfo = () => {
    const planType = profile?.account_type || 'free';
    
    switch(planType) {
      case 'business':
        return {
          name: 'Business Plan',
          description: 'Full access to all business features including staff management, job tracking, analytics, AI assistant, and business landing page.',
          priceQAR: 'QAR 45/month or QAR 400/year',
          priceUSD: 'USD 12.50/month or USD 110/year'
        };
      case 'individual':
        return {
          name: 'Individual Plan',
          description: 'Enhanced personal productivity tools with unlimited task storage, messaging, analytics, and AI assistant features.',
          priceQAR: 'QAR 20/month or QAR 200/year',
          priceUSD: 'USD 5.50/month or USD 55/year'
        };
      default:
        return {
          name: 'Free Plan',
          description: 'Basic features with limited storage and functionality.',
          priceQAR: 'Free',
          priceUSD: 'Free'
        };
    }
  };
  
  const planInfo = getPlanInfo();
  
  // Only show upgrade option for free or individual accounts
  const showUpgradeOption = profile?.account_type === 'free' || profile?.account_type === 'individual';
  
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
            </div>
          </div>
          <p className="text-muted-foreground mb-2">
            {planInfo.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{planInfo.priceQAR}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{planInfo.priceUSD}</span>
              </div>
            </div>
          </div>
          
          {showUpgradeOption && (
            <Button 
              className="w-full sm:w-auto"
              onClick={handleUpgradePlan}
            >
              {profile?.account_type === 'free' ? 'Upgrade Plan' : 'Change Plan'}
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Payment Method</h3>
          <div className="p-3 sm:p-4 border rounded-md">
            <RadioGroup 
              defaultValue="creditcard" 
              className="gap-4"
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "creditcard" | "paypal")}
            >
              <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creditcard" id="creditcard" />
                  <Label htmlFor="creditcard" className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Credit Card</span>
                  </Label>
                </div>
                <span>•••• •••• •••• 4242</span>
              </div>

              <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      className="h-5 w-5 fill-current" 
                      style={{ color: '#00457C' }}
                    >
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.483 0 6.01 0h7.826c3.913 0 6.617 2.531 6.268 6.268-.598 6.445-5.286 6.916-9.634 6.916h-2.03c-.526 0-.984.382-1.066.901l-1.134 6.268c-.82.519-.574.984-1.164.984M18.5 5.947c.205-2.153-1.354-3.55-3.79-3.55h-7.121c-.082 0-.164.082-.164.163L4.944 18.71c0 .082.082.164.164.164h2.593l.656-3.468v.164c.082-.822.574-1.354 1.067-1.354h2.266c4.372 0 7.784-1.804 8.759-6.924 0-.245.082-.57.082-.817-.082.083-.082.083-.04.083" />
                      <path d="M9.142 6.35c.04-.245.204-.408.408-.408h5.204c.613 0 1.184.082 1.715.204-.368 2.449-2.203 3.304-4.575 3.304H9.55c-.409 0-.736.326-.818.734l-.899 5.776c-.41.245-.245.49-.49.49H4.863c-.245 0-.368-.163-.327-.408L6.99 6.35h2.153z" />
                    </svg>
                    <span>PayPal</span>
                  </Label>
                </div>
                <span>paypal@example.com</span>
              </div>
            </RadioGroup>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleChangePayment}
              >
                Change Payment Method
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
              <p className="font-medium">
                {profile?.account_type === 'business' ? 'QAR 45.00' : 
                profile?.account_type === 'individual' ? 'QAR 20.00' : 'QAR 0.00'}
              </p>
            </div>
            <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
              <div>
                <p className="font-medium">March 2023</p>
                <p className="text-sm text-muted-foreground">Plan: {planInfo.name}</p>
              </div>
              <p className="font-medium">
                {profile?.account_type === 'business' ? 'QAR 45.00' : 
                profile?.account_type === 'individual' ? 'QAR 20.00' : 'QAR 0.00'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
