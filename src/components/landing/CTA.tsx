
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 px-4 bg-wakti-blue">
      <div className="container mx-auto max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-br from-wakti-blue to-blue-700 p-8 md:p-12 text-white text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who have transformed their work with WAKTI
          </p>
          <Button asChild size="lg" className="bg-white text-wakti-blue hover:bg-white/90">
            <Link to="/auth?tab=register">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
