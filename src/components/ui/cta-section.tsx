
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
  gradient?: string;
}

const CTASection = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink = "/auth",
  secondaryButtonText,
  secondaryButtonLink,
  className,
  gradient = "bg-gradient-to-br from-wakti-blue to-blue-700",
}: CTASectionProps) => {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="container mx-auto max-w-5xl">
        <div className={cn(
          "rounded-2xl p-8 md:p-12 text-white text-center animate-fade-in",
          gradient
        )}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {primaryButtonText && (
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-wakti-blue hover:bg-white/90"
              >
                <Link to={primaryButtonLink}>{primaryButtonText}</Link>
              </Button>
            )}
            
            {secondaryButtonText && secondaryButtonLink && (
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
              >
                <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTASection };
