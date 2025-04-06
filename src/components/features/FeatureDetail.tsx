
import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeatureDetailProps {
  features: string[];
}

const FeatureDetail = ({ features }: FeatureDetailProps) => {
  const { t } = useTranslation();
  
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <div className="mr-2 mt-0.5">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          </div>
          <span className="text-muted-foreground">{t(feature)}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureDetail;
