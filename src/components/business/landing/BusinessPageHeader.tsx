
import React from "react";
import { BusinessProfile } from "@/types/business.types";

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

// Create a simple component to avoid type errors
const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode,
  isAuthenticated,
  isSubscribed,
  checkingSubscription,
  subscribe,
  unsubscribe
}) => {
  return (
    <div className="business-page-header">
      <h1>{business.business_name || "Business Name"}</h1>
      {!isPreviewMode && isAuthenticated && !isSubscribed && !checkingSubscription && (
        <button 
          onClick={() => subscribe?.mutate(business.id)} 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Subscribe
        </button>
      )}
      {!isPreviewMode && isAuthenticated && isSubscribed && !checkingSubscription && (
        <button 
          onClick={() => unsubscribe?.mutate()} 
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Unsubscribe
        </button>
      )}
    </div>
  );
};

export default BusinessPageHeader;
