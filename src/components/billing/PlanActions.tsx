
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

interface PlanActionsProps {
  selectedPlan: "individual" | "business" | null;
  handleContinue: () => void;
}

const PlanActions = ({ selectedPlan, handleContinue }: PlanActionsProps) => {
  return (
    <>
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
    </>
  );
};

export default PlanActions;
