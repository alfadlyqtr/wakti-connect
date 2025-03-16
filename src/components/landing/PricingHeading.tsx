
import React from "react";

interface PricingHeadingProps {
  title: string;
  subtitle: string;
}

const PricingHeading = ({ title, subtitle }: PricingHeadingProps) => {
  return (
    <div className="text-center mb-16 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default PricingHeading;
