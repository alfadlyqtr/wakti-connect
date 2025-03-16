
import React from "react";
import FeatureHero from "@/components/features/FeatureHero";
import FeatureCategories from "@/components/features/FeatureCategories";
import FeatureGrid from "@/components/features/FeatureGrid";
import FeatureCallToAction from "@/components/features/FeatureCallToAction";
import FeaturePlanComparison from "@/components/features/FeaturePlanComparison";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      <FeatureHero />
      <FeatureCategories />
      <FeatureGrid />
      <FeatureCallToAction />
      <FeaturePlanComparison />
    </div>
  );
};

export default FeaturesPage;
