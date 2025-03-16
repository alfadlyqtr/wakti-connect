
import React from "react";
import FreePlanCard from "./plan-cards/FreePlanCard";
import IndividualPlanCard from "./plan-cards/IndividualPlanCard";
import BusinessPlanCard from "./plan-cards/BusinessPlanCard";
import { planFeatures } from "./PlanFeaturesData";

interface PlanCardsGridProps {
  selectedPlan: "individual" | "business" | null;
  setSelectedPlan: (plan: "individual" | "business" | null) => void;
  billingCycle: "monthly" | "yearly";
}

const PlanCardsGrid = ({ 
  selectedPlan, 
  setSelectedPlan, 
  billingCycle 
}: PlanCardsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Free Plan */}
      <FreePlanCard features={planFeatures.free} />
      
      {/* Individual Plan */}
      <IndividualPlanCard 
        features={planFeatures.individual}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        billingCycle={billingCycle}
      />
      
      {/* Business Plan */}
      <BusinessPlanCard 
        features={planFeatures.business}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        billingCycle={billingCycle}
      />
    </div>
  );
};

export default PlanCardsGrid;
