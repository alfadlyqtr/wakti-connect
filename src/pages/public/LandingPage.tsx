
import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import { SectionContainer } from "@/components/ui/section-container";
import DashboardPreview from "@/components/landing/DashboardPreview";
import ContactSection from "@/components/contact/ContactSection";
import BusinessHours from "@/components/landing/BusinessHours";
import Gallery from "@/components/landing/Gallery";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
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
      
      {/* Contact Us Section */}
      <ContactSection />
      
      {/* Business Hours Section */}
      <BusinessHours />

      {/* Call to Action */}
      <CTA />
    </div>
  );
};

export default LandingPage;
