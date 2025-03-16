
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeatureCallToAction = () => {
  return (
    <section className="py-16 px-4 rounded-xl bg-gradient-to-r from-wakti-blue to-blue-600 text-white mb-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of individuals and businesses who use WAKTI to streamline their productivity.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-wakti-blue hover:bg-white/90" asChild>
            <Link to="/auth">Sign Up Now</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureCallToAction;
