
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { ArrowRight } from "lucide-react";

const AboutCTA = () => {
  return (
    <SectionContainer className="py-20 text-center bg-gradient-to-b from-background to-wakti-blue/5">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the WAKTI Community</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Experience how WAKTI can transform your productivity and help your business grow.
        Join WAKTI today and experience a smarter way to work, plan, and connect!
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/auth?tab=register">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default AboutCTA;
