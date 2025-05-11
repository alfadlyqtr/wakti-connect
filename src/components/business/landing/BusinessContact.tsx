
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import BusinessContactForm from "./BusinessContactForm";

interface BusinessContactProps {
  section: BusinessPageSection;
  businessId: string;
  pageId: string;
  submitContactForm?: (data: any) => Promise<any>;
  primaryColor?: string;
}

const BusinessContact: React.FC<BusinessContactProps> = ({ 
  section, 
  businessId, 
  pageId, 
  submitContactForm,
  primaryColor
}) => {
  const content = section.section_content || {};
  
  return (
    <div className="py-12 container mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">{content.title || "Contact Us"}</h2>
        {content.subtitle && (
          <p className="text-muted-foreground">{content.subtitle}</p>
        )}
      </div>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            {submitContactForm && (
              <BusinessContactForm 
                businessId={businessId} 
                pageId={pageId}
                submitForm={submitContactForm}
                primaryColor={primaryColor}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessContact;
