
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";

const AboutCTA = () => {
  return (
    <SectionContainer className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-6">Join the WAKTI Community</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Experience how WAKTI can transform your productivity and help your business grow.
        Start your journey today with our 3-day free trial.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/auth?tab=register">Start Free Trial</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default AboutCTA;
