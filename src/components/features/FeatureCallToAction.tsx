
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeatureCallToAction = () => {
  return (
    <SectionContainer className="py-16 bg-muted/30 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of individuals and businesses who trust WAKTI for their daily 
          productivity, task management, and appointment scheduling needs.
        </p>
        <Button size="lg" asChild>
          <Link to="/auth?tab=register">
            Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
};

export default FeatureCallToAction;
export { FeatureCallToAction };
