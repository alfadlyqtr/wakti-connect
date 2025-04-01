
import React from "react";
import { BusinessProfile } from "@/types/business.types";
import BusinessSubscribeButton from "./BusinessSubscribeButton";

export interface BusinessPageHeaderProps {
  business: BusinessProfile;
  isPreviewMode?: boolean;
  isAuthenticated?: boolean;
  isSubscribed?: boolean;
  subscriptionId?: string;
  checkingSubscription?: boolean;
  subscribe?: any;
  unsubscribe?: any;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode,
  isAuthenticated,
  isSubscribed,
  checkingSubscription,
  subscribe,
  unsubscribe
}) => {
  console.log("BusinessPageHeader component rendering with:", business);
  
  return (
    <div className="business-page-header py-8">
      <div className="flex flex-col items-center">
        {business.avatar_url && (
          <div className="mb-4">
            <img 
              src={business.avatar_url} 
              alt={business.business_name || "Business"} 
              className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
              onError={(e) => {
                console.error("Error loading avatar image:", e);
                // Don't hide the image container, just log the error
              }}
            />
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{business.business_name || "Business Name"}</h1>
        
        {/* Subscribe button placed directly under the business name */}
        {!isPreviewMode && isAuthenticated && (
          <BusinessSubscribeButton 
            businessId={business.id}
            isAuthenticated={isAuthenticated}
            backgroundColor="#0053c3"
            textColor="#ffffff"
            customText={isSubscribed ? "Unsubscribe" : "Subscribe"}
            gradientFrom="#0053c3"
            gradientTo="#3B82F6"
            variant="gradient"
            borderRadius="0.5rem"
            boxShadow="md"
            className="px-6 py-2 mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default BusinessPageHeader;
