
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import { BusinessSocialLink } from "@/hooks/useBusinessSocialLinks";
import { BusinessHours } from "@/hooks/useBusinessHours";
import BusinessPageHeader from "@/features/business/components/BusinessPageHeader";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";

interface BusinessPageContentProps {
  businessPage: BusinessPage;
  pageSections: BusinessPageSection[];
  socialLinks: BusinessSocialLink[];
  isPreviewMode?: boolean;
  isAuthenticated?: boolean;
  businessHours?: BusinessHours;
  displayStyle?: string;
}

const BusinessPageContent: React.FC<BusinessPageContentProps> = ({
  businessPage,
  pageSections,
  socialLinks,
  isPreviewMode = false,
  isAuthenticated = false,
  businessHours,
  displayStyle = 'icons'
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{businessPage.page_title || "Business Name"}</h1>
          <p className="text-muted-foreground">{businessPage.description || "Business description"}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Business</h2>
          <p>{businessPage.description || "No description available."}</p>
        </div>

        {/* Display information about sections being available in preview mode */}
        {pageSections.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">This business hasn't added any sections to their page yet.</p>
          </div>
        )}

        {/* Powered by WAKTI badge */}
        <div className="mt-12 text-center">
          <PoweredByWAKTI />
        </div>
      </div>
    </div>
  );
};

export default BusinessPageContent;
