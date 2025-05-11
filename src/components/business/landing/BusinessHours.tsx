import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessHoursProps {
  section: BusinessPageSection;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ section }) => {
  // Since this functionality has been removed as mentioned in the original file
  // We're keeping it as a null component to maintain compatibility
  return null;
};

export default BusinessHours;
