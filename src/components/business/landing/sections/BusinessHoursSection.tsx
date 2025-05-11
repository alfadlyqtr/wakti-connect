
import React from "react";
import { BusinessHour, BusinessPageSection } from "@/types/business.types";

interface BusinessHoursSectionProps {
  section?: BusinessPageSection;
  businessHours?: BusinessHour[];
}

const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({ section, businessHours }) => {
  // This component has been intentionally emptied as the business hours functionality has been removed
  return null;
};

export default BusinessHoursSection;
