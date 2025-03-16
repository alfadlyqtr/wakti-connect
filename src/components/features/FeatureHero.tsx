
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeatureHero = () => {
  return (
    <SectionContainer className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Powerful Features for Productivity
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        WAKTI combines task management, appointment scheduling, and team collaboration 
        into one powerful platform designed for individuals and businesses.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/auth?tab=register">Start Free Trial</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/pricing">View Pricing Plans</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeatureHero;
