
import React from "react";
import { Check } from "lucide-react";

interface FeatureDetailProps {
  features: string[];
}

const FeatureDetail = ({ features }: FeatureDetailProps) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureDetail;
