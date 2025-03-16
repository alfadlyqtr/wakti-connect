
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutHero = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-wakti-blue to-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
          At WAKTI, we're on a mission to help individuals and businesses manage their time more effectively, 
          boost productivity, and achieve their goals with less stress.
        </p>
        <Button 
          size="lg" 
          className="bg-white text-wakti-blue hover:bg-white/90"
          asChild
        >
          <Link to="/auth">Join Our Community</Link>
        </Button>
      </div>
    </section>
  );
};

export default AboutHero;
