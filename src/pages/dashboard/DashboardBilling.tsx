
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Receipt, Crown, Calendar, ArrowRight, Check, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BillingInfo {
  plan: "free" | "individual" | "business";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
  amount: number;
  interval: "month" | "year";
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}

const DashboardBilling = () => {
  const [selectedPlan, setSelectedPlan] = useState<"individual" | "business" | null>(null);

  // Fetch user's billing info
  const { data: billingInfo, isLoading } = useQuery({
    queryKey: ['billingInfo'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // In a real implementation, this would fetch actual billing info from Supabase/Stripe
      // For now, we'll use placeholder data
      const { data: userData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.session.user.id)
        .single();
        
      return {
        plan: userData?.account_type || "free",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: userData?.account_type === "individual" ? 9.99 : userData?.account_type === "business" ? 29.99 : 0,
        interval: "month"
      } as BillingInfo;
    }
  });

  // Fetch user's invoices
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      // In a real implementation, this would fetch actual invoices from Supabase/Stripe
      // For now, we'll use placeholder data
      return [
        {
          id: "INV-001",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: billingInfo?.amount || 0,
          status: "paid",
          downloadUrl: "#"
        },
        {
          id: "INV-002",
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          amount: billingInfo?.amount || 0,
          status: "paid",
          downloadUrl: "#"
        }
      ] as Invoice[];
    },
    enabled: !!billingInfo && billingInfo.plan !== "free"
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpgrade = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a plan before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would redirect to a checkout page
    toast({
      title: "Redirecting to checkout",
      description: `You'll be redirected to complete your ${selectedPlan} plan upgrade.`,
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription canceled",
      description: "Your subscription has been canceled. You'll continue to have access until the end of your billing period.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing information.
        </p>
      </div>
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
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
              
              {billingInfo?.plan === "free" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade Your Plan</CardTitle>
                    <CardDescription>
                      Choose a plan that suits your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan === "individual" ? "border-wakti-blue bg-wakti-blue/5" : "hover:border-input"
                        }`}
                        onClick={() => setSelectedPlan("individual")}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-lg">Individual</h3>
                            <p className="text-muted-foreground text-sm">For personal productivity</p>
                          </div>
                          <Badge variant="outline" className={selectedPlan === "individual" ? "bg-wakti-blue text-white" : ""}>
                            {selectedPlan === "individual" ? <Check className="h-4 w-4" /> : null}
                          </Badge>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">$9.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Full task management</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Full appointment scheduling</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Messaging capabilities</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Priority support</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan === "business" ? "border-wakti-blue bg-wakti-blue/5" : "hover:border-input"
                        }`}
                        onClick={() => setSelectedPlan("business")}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-lg">Business</h3>
                            <p className="text-muted-foreground text-sm">For teams and businesses</p>
                          </div>
                          <Badge variant="outline" className={selectedPlan === "business" ? "bg-wakti-blue text-white" : ""}>
                            {selectedPlan === "business" ? <Check className="h-4 w-4" /> : null}
                          </Badge>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">$29.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Everything in Individual plan</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Team task assignments</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Staff management</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Business analytics & reports</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={handleUpgrade} disabled={!selectedPlan}>
                        Continue to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingInfo?.plan === "free" ? (
                    <div className="text-center py-6">
                      <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">No Payment Methods</h3>
                      <p className="text-muted-foreground mb-4">
                        You'll need to add a payment method when you upgrade to a paid plan.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                  )}
                </CardContent>
                {billingInfo?.plan !== "free" && (
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Update Payment Method
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingInfo?.plan === "free" ? (
                <div className="text-center py-6">
                  <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Invoices</h3>
                  <p className="text-muted-foreground">
                    You haven't been charged yet as you're on the free plan.
                  </p>
                </div>
              ) : invoices?.length === 0 ? (
                <div className="text-center py-6">
                  <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Invoices Yet</h3>
                  <p className="text-muted-foreground">
                    Your billing history will appear here once you've been charged.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices?.map((invoice) => (
                    <div key={invoice.id} className="border rounded-md p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          invoice.status === "paid" ? "outline" :
                          invoice.status === "pending" ? "secondary" :
                          "destructive"
                        }>
                          {invoice.status === "paid" ? (
                            <ShieldCheck className="h-3 w-3 mr-1" />
                          ) : invoice.status === "pending" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                        <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={invoice.downloadUrl} download>
                            <Receipt className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBilling;
