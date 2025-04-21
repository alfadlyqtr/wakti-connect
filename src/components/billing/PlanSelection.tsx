
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PlanSelectionProps {
  selectedPlan: "individual" | "business" | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<"individual" | "business" | null>>;
}

const PlanSelection = ({ selectedPlan, setSelectedPlan }: PlanSelectionProps) => {
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

  return (
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
              <span className="text-2xl font-bold">QAR 35</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>3-day free trial</span>
              </li>
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
            className={`border rounded-lg p-4 cursor-pointer transition-all relative overflow-hidden ${
              selectedPlan === "business" ? "border-wakti-blue bg-wakti-blue/5" : "hover:border-input"
            }`}
            onClick={() => setSelectedPlan("business")}
          >
            <div className="absolute top-0 right-0 bg-wakti-blue text-white px-3 py-1 text-xs font-medium">
              Popular
            </div>
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
              <span className="text-2xl font-bold">QAR 50</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>3-day free trial</span>
              </li>
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
  );
};

export default PlanSelection;
