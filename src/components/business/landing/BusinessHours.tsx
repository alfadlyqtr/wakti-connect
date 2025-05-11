
import React from "react";
import { BusinessPageSection, BusinessHour } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessHoursProps {
  section?: BusinessPageSection;
  businessHours?: BusinessHour[];
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ section, businessHours }) => {
  // Since this functionality has been removed as mentioned in the original file
  // We're keeping it as a null component to maintain compatibility
  // But we're making sure it accepts the businessHours prop properly
  return null;
};

export default BusinessHours;
