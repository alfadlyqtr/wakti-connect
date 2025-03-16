
import React from "react";
import { FeatureSection } from "@/components/ui/feature-section";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon, title, description, delay = "0ms" }: FeatureCardProps) => {
  return (
    <FeatureSection
      icon={icon}
      title={title}
      description={description}
      delay={delay}
    />
  );
};

export default FeatureCard;
