
import React from "react";
import PricingCard from "./PricingCard";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  savings?: string | null;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlight: boolean;
}

interface PricingCardsGridProps {
  pricingPlans: PricingPlan[];
}

const PricingCardsGrid = ({ pricingPlans }: PricingCardsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.name} {...plan} />
      ))}
    </div>
  );
};

export default PricingCardsGrid;
