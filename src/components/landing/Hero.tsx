
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
              All-in-One Productivity Platform
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Work Smarter with WAKTI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan, schedule, message, and manage all in one place.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/auth?tab=register">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="#features">
                See Features
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 text-sm text-muted-foreground">
            <p>No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
