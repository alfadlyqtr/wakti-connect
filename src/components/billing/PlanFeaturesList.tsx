
import React from "react";
import { Check, X } from "lucide-react";

interface Feature {
  name: string;
  included: boolean;
}

interface PlanFeaturesListProps {
  features: Feature[];
}

const PlanFeaturesList = ({ features }: PlanFeaturesListProps) => {
  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          {feature.included ? (
            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          ) : (
            <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <span className={feature.included ? "" : "text-muted-foreground"}>
            {feature.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PlanFeaturesList;
