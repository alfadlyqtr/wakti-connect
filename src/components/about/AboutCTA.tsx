
import React from "react";
import { CTASection } from "@/components/ui/cta-section";

const AboutCTA = () => {
  return (
    <CTASection 
      title="Ready to Transform Your Productivity?" 
      description="Join thousands of users who've already discovered the power of WAKTI."
      primaryButtonText="Get Started for Free"
      primaryButtonLink="/auth"
      secondaryButtonText="Contact Sales"
      secondaryButtonLink="/contact"
    />
  );
};

export default AboutCTA;
