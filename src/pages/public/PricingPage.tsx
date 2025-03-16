
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import BillingCycleToggle from "@/components/billing/BillingCycleToggle";
import PricingCardsGrid from "@/components/pricing/PricingCardsGrid";
import FeaturesComparisonTable from "@/components/pricing/FeaturesComparisonTable";
import PricingFaqs from "@/components/pricing/PricingFaqs";
import { usePricingPlans } from "@/components/pricing/usePricingPlans";

const PricingPage = () => {
  const { billingCycle, setBillingCycle, pricingPlans } = usePricingPlans();

  return (
    <div className="min-h-screen py-16">
      <SectionContainer className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing for Everyone</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.
        </p>
        
        <BillingCycleToggle 
          billingCycle={billingCycle} 
          setBillingCycle={setBillingCycle} 
        />
      </SectionContainer>

      <SectionContainer className="mb-16">
        <PricingCardsGrid pricingPlans={pricingPlans} />
      </SectionContainer>

      <SectionContainer className="mb-12 bg-muted/30 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Plans in Detail</h2>
        <FeaturesComparisonTable />
      </SectionContainer>

      <SectionContainer>
        <PricingFaqs />
      </SectionContainer>
    </div>
  );
};

export default PricingPage;
