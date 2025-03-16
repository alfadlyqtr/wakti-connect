
import React from "react";
import FeatureHero from "@/components/features/FeatureHero";
import FeatureCategories from "@/components/features/FeatureCategories";
import FeatureGrid from "@/components/features/FeatureGrid";
import EventFeatures from "@/components/features/EventFeatures";
import FeaturePlanComparison from "@/components/features/FeaturePlanComparison";
import FeatureCallToAction from "@/components/features/FeatureCallToAction";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      <FeatureHero />
      <FeatureCategories />
      <EventFeatures />
      <FeatureGrid />
      <FeaturePlanComparison />
      <FeatureCallToAction />
    </div>
  );
};

export default FeaturesPage;
