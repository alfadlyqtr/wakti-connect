
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import PlanFeaturesList from "../PlanFeaturesList";

interface Feature {
  name: string;
  included: boolean;
}

interface BusinessPlanCardProps {
  features: Feature[];
  selectedPlan: "individual" | "business" | null;
  setSelectedPlan: (plan: "individual" | "business" | null) => void;
  billingCycle: "monthly" | "yearly";
}

const BusinessPlanCard = ({ 
  features, 
  selectedPlan, 
  setSelectedPlan,
  billingCycle
}: BusinessPlanCardProps) => {
  const getPrice = () => {
    const basePrice = 29.99;
    return billingCycle === "yearly" ? (basePrice * 10).toFixed(2) : basePrice.toFixed(2);
  };

  const getSavings = () => {
    const monthlyPrice = 29.99;
    return (monthlyPrice * 12 - monthlyPrice * 10).toFixed(2);
  };

  return (
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
          <span className="text-3xl font-bold">${getPrice()}</span>
          <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
          {billingCycle === "yearly" && (
            <div className="mt-1">
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Save ${getSavings()}/year
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[360px] overflow-y-auto">
        <PlanFeaturesList features={features} />
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
  );
};

export default BusinessPlanCard;
