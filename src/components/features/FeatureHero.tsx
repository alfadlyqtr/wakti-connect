
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";

const FeatureHero = () => {
  return (
    <SectionContainer className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Everyone</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Discover how WAKTI helps individuals and businesses manage tasks, appointments, 
        and communications all in one place.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" asChild>
          <Link to="/auth">Try For Free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/pricing">View Pricing</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeatureHero;
