
import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";

interface FeaturesHeadingProps {
  title: string;
  subtitle: string;
}

const FeaturesHeading = ({ title, subtitle }: FeaturesHeadingProps) => {
  return <SectionHeading title={title} subtitle={subtitle} />;
};

export default FeaturesHeading;
