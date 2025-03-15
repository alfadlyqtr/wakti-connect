
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight, Sparkles, Shield, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardUpgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<"individual" | "business" | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();

  const planFeatures = {
    free: [
      { name: "View-only access to tasks", included: true },
      { name: "View-only access to appointments", included: true },
      { name: "Limited notifications", included: true },
      { name: "Basic dashboard", included: true },
      { name: "Full task creation & management", included: false },
      { name: "Appointment scheduling", included: false },
      { name: "Messaging capabilities", included: false },
      { name: "Staff management", included: false },
    ],
    individual: [
      { name: "Full task management", included: true },
      { name: "Full appointment scheduling", included: true },
      { name: "Messaging capabilities", included: true },
      { name: "Contact management", included: true },
      { name: "Full notifications", included: true },
      { name: "Priority support", included: true },
      { name: "Staff management", included: false },
      { name: "Business analytics", included: false },
    ],
    business: [
      { name: "Everything in Individual plan", included: true },
      { name: "Team task assignments", included: true },
      { name: "Business-wide appointments", included: true },
      { name: "Staff management", included: true },
      { name: "Work logs & tracking", included: true },
      { name: "Service management", included: true },
      { name: "Business analytics & reports", included: true },
      { name: "Premium support", included: true },
    ],
  };

  const handleContinue = () => {
    if (!selectedPlan) return;
    navigate('/dashboard/billing');
  };

  const getPrice = (plan: "individual" | "business") => {
    const basePrice = plan === "individual" ? 9.99 : 29.99;
    return billingCycle === "yearly" ? (basePrice * 10).toFixed(2) : basePrice.toFixed(2);
  };

  const getSavings = (plan: "individual" | "business") => {
    const monthlyPrice = plan === "individual" ? 9.99 : 29.99;
    return (monthlyPrice * 12 - monthlyPrice * 10).toFixed(2);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold mb-2">Upgrade Your Wakti Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs and unlock the full potential of Wakti.
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center bg-muted rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === "monthly" ? "bg-background shadow-sm" : ""
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === "yearly" ? "bg-background shadow-sm" : ""
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            <span className="flex items-center gap-2">
              Yearly
              <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">Save 16%</Badge>
            </span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Free
              <Badge variant="outline" className="ml-2">Current</Badge>
            </CardTitle>
            <CardDescription>For individuals just getting started</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="h-[360px] overflow-y-auto">
            <ul className="space-y-2">
              {planFeatures.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? "" : "text-muted-foreground"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>
        
        {/* Individual Plan */}
        <Card className={selectedPlan === "individual" ? "border-wakti-blue shadow-md" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-wakti-blue" />
                Individual
              </CardTitle>
              <div className="shrink-0">
                <div 
                  className={`h-5 w-5 rounded-full border-2 cursor-pointer transition-all ${
                    selectedPlan === "individual" ? "bg-wakti-blue border-wakti-blue" : "border-muted-foreground"
                  }`}
                  onClick={() => setSelectedPlan("individual")}
                >
                  {selectedPlan === "individual" && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </div>
            <CardDescription>For personal productivity</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getPrice("individual")}</span>
              <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
              {billingCycle === "yearly" && (
                <div className="mt-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Save ${getSavings("individual")}/year
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[360px] overflow-y-auto">
            <ul className="space-y-2">
              {planFeatures.individual.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? "" : "text-muted-foreground"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full relative overflow-hidden" 
              onClick={() => setSelectedPlan("individual")}
              variant={selectedPlan === "individual" ? "default" : "outline"}
            >
              {selectedPlan === "individual" ? "Selected" : "Choose Plan"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Business Plan */}
        <Card className={selectedPlan === "business" ? "border-wakti-blue shadow-md" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-wakti-gold" />
                Business
              </CardTitle>
              <div className="shrink-0">
                <div 
                  className={`h-5 w-5 rounded-full border-2 cursor-pointer transition-all ${
                    selectedPlan === "business" ? "bg-wakti-blue border-wakti-blue" : "border-muted-foreground"
                  }`}
                  onClick={() => setSelectedPlan("business")}
                >
                  {selectedPlan === "business" && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </div>
            <CardDescription>For teams and businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getPrice("business")}</span>
              <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
              {billingCycle === "yearly" && (
                <div className="mt-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Save ${getSavings("business")}/year
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[360px] overflow-y-auto">
            <ul className="space-y-2">
              {planFeatures.business.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => setSelectedPlan("business")}
              variant={selectedPlan === "business" ? "default" : "outline"}
            >
              {selectedPlan === "business" ? "Selected" : "Choose Plan"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button size="lg" disabled={!selectedPlan} onClick={handleContinue}>
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
        <Shield className="h-4 w-4" />
        <span>Secure payment processing. Cancel or change your plan anytime.</span>
      </div>
    </div>
  );
};

export default DashboardUpgrade;
