
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#E8DCC4] to-[#FFFFFF] px-4">
      <div className="max-w-2xl w-full mx-auto text-center space-y-8 py-16">
        <img
          src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png"
          alt="WAKTI"
          className="w-16 h-16 mx-auto rounded-xl shadow-md mb-3"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A1172]">
          Work Smarter,<br />
          Live Better with WAKTI
        </h1>
        <p className="text-lg md:text-xl text-[#0A1172]/70 max-w-xl mx-auto">
          All-in-one productivity & business management for everyone.<br />
          Plan, schedule, communicate, and manage your workflow with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#0A1172] text-white hover:bg-[#232D4B] w-full sm:w-auto"
          >
            <Link to="/auth?tab=register">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-[#0A1172] text-[#0A1172] hover:bg-[#0A1172]/10 w-full sm:w-auto"
          >
            <Link to="/features">See Features</Link>
          </Button>
        </div>
        <div className="text-sm text-[#0A1172]/50 pt-4">
          No credit card required · 3-day free trial
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
