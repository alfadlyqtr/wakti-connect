
import React from "react";

interface FeatureSectionProps { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color?: string;
}

const FeatureSection = ({ 
  icon, 
  title, 
  description, 
  color = "bg-wakti-blue/10 text-wakti-blue" 
}: FeatureSectionProps) => (
  <div className="flex flex-col items-start gap-4 p-6 rounded-xl border hover:shadow-md transition-all">
    <div className={`p-2 rounded-lg ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default FeatureSection;
