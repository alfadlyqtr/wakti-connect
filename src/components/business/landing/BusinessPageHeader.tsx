
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
      {business.avatar_url && (
        <div className="flex justify-center mb-4">
          <img 
            src={business.avatar_url} 
            alt={business.business_name || "Business"} 
            className="h-24 w-24 rounded-full object-cover border-2 border-primary/20 mb-4"
            onError={(e) => {
              console.error("Error loading avatar image:", e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold text-center">{business.business_name || "Business Name"}</h1>
      
      {!isPreviewMode && isAuthenticated && !isSubscribed && !checkingSubscription && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => subscribe?.mutate(business.id)} 
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Subscribe
          </button>
        </div>
      )}
      
      {!isPreviewMode && isAuthenticated && isSubscribed && !checkingSubscription && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => unsubscribe?.mutate()} 
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessPageHeader;
