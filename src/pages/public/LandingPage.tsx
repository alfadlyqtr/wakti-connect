
import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import { SectionContainer } from "@/components/ui/section-container";
import DashboardPreview from "@/components/landing/DashboardPreview";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />

      <SectionContainer className="pb-0">
        <DashboardPreview />
      </SectionContainer>

      <Features />

      <Pricing />

      <CTA />
    </div>
  );
};

export default LandingPage;
