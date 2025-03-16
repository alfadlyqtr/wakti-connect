
import React from "react";

interface FeatureDetailProps {
  title?: string;
  features: string[];
}

const FeatureDetail = ({ title, features }: FeatureDetailProps) => (
  <div className="mb-8">
    {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <span className="text-green-500 mr-2">✅</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default FeatureDetail;
