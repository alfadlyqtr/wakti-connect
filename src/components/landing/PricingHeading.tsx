
import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";

interface PricingHeadingProps {
  title: string;
  subtitle: string;
}

const PricingHeading = ({ title, subtitle }: PricingHeadingProps) => {
  return <SectionHeading title={title} subtitle={subtitle} />;
};

export default PricingHeading;
