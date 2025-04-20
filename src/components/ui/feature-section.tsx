
import React from "react";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  delay?: string;
}

const FeatureSection = ({
  icon,
  title,
  description,
  className,
  iconClassName,
  delay = "0ms",
}: FeatureSectionProps) => {
  return (
    <div 
      className={cn(
        "bg-wakti-beige/50 p-6 rounded-lg border border-wakti-navy/10 hover:shadow-md transition-all duration-300 animate-slide-in",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg bg-wakti-navy/10 flex items-center justify-center mb-4",
        iconClassName
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-wakti-navy">{title}</h3>
      <p className="text-wakti-navy/70">{description}</p>
    </div>
  );
};

export { FeatureSection };
