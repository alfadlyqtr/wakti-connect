
import React from "react";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureSection = ({ icon, title, description, color }: FeatureSectionProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureSection;
