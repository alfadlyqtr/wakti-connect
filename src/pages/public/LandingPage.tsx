
import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import { SectionContainer } from "@/components/ui/section-container";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header is rendered here */}
      <Header />
      
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
