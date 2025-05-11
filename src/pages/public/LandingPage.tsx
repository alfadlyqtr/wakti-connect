
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
      {/* Header is now rendered in PublicLayout.tsx */}
      
      {/* Hero Section */}
      <Hero />

      {/* Dashboard Preview Section */}
      <SectionContainer className="pb-0">
        <DashboardPreview />
      </SectionContainer>

      {/* Features Section */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Call to Action */}
      <CTA />
      
      {/* Footer is now handled by PublicLayout.tsx */}
    </div>
  );
};

export default LandingPage;
