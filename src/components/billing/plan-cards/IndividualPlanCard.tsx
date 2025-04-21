
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import PlanFeaturesList from "../PlanFeaturesList";

interface Feature {
  name: string;
  included: boolean;
}

interface IndividualPlanCardProps {
  features: Feature[];
  selectedPlan: "individual" | "business" | null;
  setSelectedPlan: (plan: "individual" | "business" | null) => void;
  billingCycle: "monthly" | "yearly";
}

const IndividualPlanCard = ({ 
  features, 
  selectedPlan, 
  setSelectedPlan,
  billingCycle
}: IndividualPlanCardProps) => {
  const getPrice = () => {
    const basePrice = 35;
    return billingCycle === "yearly" ? (basePrice * 10).toFixed(2) : basePrice.toFixed(2);
  };

  const getSavings = () => {
    const monthlyPrice = 35;
    return (monthlyPrice * 12 - monthlyPrice * 10).toFixed(2);
  };

  return (
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
          <span className="text-3xl font-bold">QAR {getPrice()}</span>
          <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
          {billingCycle === "yearly" && (
            <div className="mt-1">
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Save QAR {getSavings()}/year
              </Badge>
            </div>
          )}
          <div className="mt-1 text-sm text-muted-foreground">
            Includes 3-day free trial
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[360px] overflow-y-auto">
        <PlanFeaturesList features={features} />
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
  );
};

export default IndividualPlanCard;
